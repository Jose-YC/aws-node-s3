import { Readable } from 'stream';
import { dynamoDb, PutCommand, GetCommand, 
         QueryCommand, UpdateCommand, PutObjectCommand, 
         getSignedUrl, s3Client,
         GetObjectCommand} from '../../data/Dynamodb/dynamodb';
import { CustomError } from '../../handler/errors/custom.error';
import { CreatePhotoDtos } from '../dtos/create.photo.dtos';
import { PhotoEntity } from '../entity/photo';
import { streamToBuffer } from '../handler/buffer.photo';
import { PhotoTransformer } from '../handler/transformations.handler';
import { PhotoDtos } from '../dtos/update.phoo.dtos';
import { PaginateDtos } from '../../DTO/paginate.dtos';
import { PhotoIdDtos } from '../dtos/id.photo.dtos';

export class PhotoDatasources {

    async url(ids: PhotoIdDtos): Promise<String> {

        const key = `${ids.userid}/${ids.photoid}`;

        const command = new PutObjectCommand({
            Bucket: 'bucket-serverless-github-challenge',
            Key: key
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        if (!uploadUrl) throw CustomError.badRequest("Carga de archivo fallida");

        return uploadUrl    
    }
    async post(photo: CreatePhotoDtos): Promise<boolean> {
        const params = {
            TableName: 'Rol',
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
            TableName: 'Rol',
            Key: { pk: `USER#${ids.userid}`, sk: `PHOTO#${ids.photoid}` }
        };
        const { Item } = await dynamoDb.send(new GetCommand(params));
        if (!Item) throw CustomError.badRequest("No exite la imagen");

        return PhotoEntity.fromObject(Item!);
    }
    async delete(ids: PhotoIdDtos): Promise<boolean> {
        const params = {
            TableName: 'Rol',
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
            TableName: 'Rol',
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
            TableName: 'Rol',
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
    async transform( photo: PhotoDtos ): Promise<Buffer<ArrayBufferLike>>{
        const params = {
            Bucket: 'bucket-serverless-github-challenge',
            Key: `${photo.ids.userid}/${photo.ids.photoid}`
        };

        const response = await s3Client.send(new GetObjectCommand(params));
        if (response.$metadata.httpStatusCode !== 200) throw CustomError.badRequest("No se pudo obtener la imagen");
        
        const buffer = await streamToBuffer(response.Body as Readable);
        if (!buffer) throw CustomError.badRequest("No se pudo obtener la imagen");

        const imagebuffer = (await new PhotoTransformer(buffer).applyAll(photo.transformations)).getBuffer();
        if (!imagebuffer) throw CustomError.badRequest("No se pudo obtener la imagen");

  
        return imagebuffer
    }
}