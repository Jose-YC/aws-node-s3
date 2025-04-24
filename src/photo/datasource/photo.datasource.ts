import { Readable } from 'stream';
import { dynamoDb, PutCommand, GetCommand, 
         QueryCommand, UpdateCommand, PutObjectCommand, 
         getSignedUrl, s3Client, GetObjectCommand} from '../../data/Dynamodb/dynamodb';
import { CustomError } from '../../handler/errors/custom.error';
import { CreatePhotoDtos, PhotoIdDtos, PhotoDtos } from '../dtos';
import { streamToBuffer, PhotoTransformer } from '../handler';
import { PaginateDtos } from '../../DTO/paginate.dtos';
import { PhotoEntity } from '../entity/photo';

export class PhotoDatasources {

    constructor(
        private readonly tableName = process.env.PHOTO_TABLE,
        private readonly bucketName = process.env.BUCKET,
    ){}

    async url(ids: PhotoIdDtos, contentType: string): Promise<String> {

        const key = `${ids.userid}/${ids.photoid}.${contentType}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: `image/${contentType}`,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        if (!uploadUrl) throw CustomError.badRequest("Carga de archivo fallida");

        return uploadUrl    
    }
    async post(photo: CreatePhotoDtos): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Item: {
                pk: `USER#${photo.userid}`,
                sk: `PHOTO#${photo.id}`,

                gsi1pk: `PHOTO#USER#${photo.userid}`,
                gsi1sk: 'STATE#1',

                gsi2pk: `ENTITY#PHOTO`,
                gsi2sk: 'STATE#1',

                id: photo.id,
                url: photo.url,
                userid: photo.userid,
                type: photo.type,
                state: 1,
                _createdAt: new Date().toISOString(),
                _updateAt: new Date().toISOString()
            },
            ConditionExpression: 'attribute_not_exists(pk)'
        };

        const respose = await dynamoDb.send(new PutCommand(params));

        return !!respose
    }
    async getById(ids: PhotoIdDtos): Promise<PhotoEntity> {
        const params = {
            TableName: this.tableName,
            Key: { pk: `USER#${ids.userid}`, sk: `PHOTO#${ids.photoid}` }
        };
        const { Item } = await dynamoDb.send(new GetCommand(params));
        if (!Item) throw CustomError.badRequest("No exite la imagen");

        return PhotoEntity.fromObject(Item!);
    }
    async delete(ids: PhotoIdDtos): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: { pk: `USER#${ids.userid}`, sk:`PHOTO#${ids.photoid}` },
            UpdateExpression: 'SET #gsi1sk = :newStateIndex, #gsi2pk= :newStateIndex2, #state = :newState',
            ExpressionAttributeNames: {
                '#gsi1sk': 'gsi1sk',
                '#gsi2pk': 'gsi2pk',
                '#state': 'state'
            },
            ExpressionAttributeValues: {
                ':newStateIndex': 'STATE#0',  // 0 para inactivo, 1 para activo
                ':newStateIndex2': 'STATE#0',  // 0 para inactivo, 1 para activo
                ':newState': 0  // 0 para inactivo, 1 para activo
            },
            ConditionExpression: 'attribute_exists(pk) AND attribute_exists(sk)'
        };
        const response = await dynamoDb.send(new UpdateCommand(params));
        if (response.$metadata.httpStatusCode !== 200) throw CustomError.badRequest('Error al eliminar la imagen');
        
        return !!response
    }
    async getId( paginate: PaginateDtos): Promise<{items: PhotoEntity[], startkey?: string}> {
        const params = {
            TableName: this.tableName,
            IndexName: 'GSI1',
            KeyConditionExpression: 'gsi1pk = :pk AND begins_with(gsi1sk, :statePrefix)',
            ExpressionAttributeValues: {
                ':pk': `PHOTO#USER#${paginate.id}`,
                ':statePrefix': 'STATE#1'
            },
            Limit: paginate.lim,
            ...(paginate.startkey ? {ExclusiveStartKey: { pk: `USER#${paginate.id}`, sk: `PHOTO#${paginate.startkey}`, gsi1sk: 'STATE#1', gsi1pk: `PHOTO#USER#${paginate.id}`}} : {})
        };

        const { Items, LastEvaluatedKey } = await dynamoDb.send(new QueryCommand(params));

        return {
            items: Items!.map(photo => PhotoEntity.fromObject(photo)),
            startkey: LastEvaluatedKey ? LastEvaluatedKey.sk.replace('PHOTO#', '') : null
        };
    }
    async getAll( paginate: PaginateDtos): Promise<{items: PhotoEntity[], startkey?: string}>{
        let nextPageToken;

        const params = {
            TableName: this.tableName,
            IndexName: 'GSI2',
            KeyConditionExpression: 'gsi2pk = :pk AND begins_with(gsi2sk, :state)',
            ExpressionAttributeValues: {
                ':pk': 'ENTITY#PHOTO',
                ':state': 'STATE#1'
            },
            Limit: paginate.lim,
            ...(paginate.startkey ? {
                ExclusiveStartKey: { 
                    pk: `USER#${paginate.startkey!.split('-')[0]}`, 
                    sk: `PHOTO#${paginate.startkey!.split('-')[1]}`, 
                    gsi2sk: 'STATE#1', 
                    gsi2pk: 'ENTITY#PHOTO'
                }
            } : {})

        };

        const { Items, LastEvaluatedKey } = await dynamoDb.send(new QueryCommand(params));
        if (LastEvaluatedKey) nextPageToken = `${LastEvaluatedKey.pk.replace('USER#', '')}-${ LastEvaluatedKey.sk.replace('PHOTO#', '')}`;
        
        return {
                    items: Items!.map(photo => PhotoEntity.fromObject(photo)),
                    startkey: nextPageToken
                };
    }
    async transform( photo: PhotoDtos ): Promise<{imagebuffer: Buffer<ArrayBufferLike>, type: string}> {

        const image = await this.getById(photo.ids)

        const params = {
            Bucket: this.bucketName,
            Key: `${image.userid}/${image.id}.${image.type}`,
        };

        const {Body, ContentLength, ContentType } = await s3Client.send(new GetObjectCommand(params));

        if (ContentLength === 0) throw CustomError.badRequest("No se pudo obtener la imagen del s3");
        if (ContentType && !ContentType.startsWith('image/')) throw CustomError.badRequest("El formato de la imagen no es valido");
        
        const buffer = await streamToBuffer(Body as Readable);
        if (!buffer || buffer.length === 0) throw CustomError.badRequest("No se pudo obtener la imagen del buffer");

        const imagebuffer = await (await new PhotoTransformer(buffer).applyAll(photo.transformations)).getBuffer();
        if (!imagebuffer) throw CustomError.badRequest("No se pudo obtener la imagen de la transformacion");

        return {imagebuffer, type: image.type};
    }
}