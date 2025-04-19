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
import { TransformationsPhotoDtos } from '../dtos/transformations.photo.dtos';

export class PhotoDatasources {

    async url(userid:string, photoid:string, contentType:string): Promise<String> {

        const key = `${userid}/${photoid}`;

        const command = new PutObjectCommand({
            Bucket: 'bucket-serverless-github-challenge',
            Key: key,
            ContentType: contentType
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
    async getById(photoid: string, userid:string): Promise<PhotoEntity> {
        const params = {
            TableName: 'Rol',
            Key: { pk: `USER#${userid}`, sk: `PHOTO#${photoid}` }
        };
        const { Item } = await dynamoDb.send(new GetCommand(params));
        if (!Item) throw CustomError.badRequest("No exite la imagen");

        return PhotoEntity.fromObject(Item!);
    }
    async delete(photoid:string, userid: string): Promise<boolean> {
        const params = {
            TableName: 'Rol',
            Key: { pk: `USER#${userid}`, sk:`PHOTO#${photoid}` },
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
    async getId( userid: string, lim: number, startkey?: string): Promise<{items: PhotoEntity[], startkey?: string}> {
        const params = {
            TableName: 'Rol',
            IndexName: 'GSI1',
            KeyConditionExpression: 'gsi1pk = :pk AND begins_with(gsi1sk, :statePrefix)',
            ExpressionAttributeValues: {
                ':pk': `PHOTO#USER#${userid}`,
                ':statePrefix': 'STATE#1'
            },
            Limit: lim,
            ...(startkey ? {ExclusiveStartKey: { pk: `USER#${userid}`, sk: `PHOTO#${startkey}`, gsi1sk: 'STATE#1', gsi1pk: `PHOTO#USER#${userid}`}} : {})
        };

        const { Items, LastEvaluatedKey } = await dynamoDb.send(new QueryCommand(params));

        return {
            items: Items!.map(photo => PhotoEntity.fromObject(photo)),
            startkey: LastEvaluatedKey ? LastEvaluatedKey.sk.replace('PHOTO#', '') : null
        };
    }
    async getAll( lim: number, startkey?: string): Promise<{items: PhotoEntity[], startkey?: string}>{
        let nextPageToken;

        const params = {
            TableName: 'Rol',
            IndexName: 'GSI2',
            KeyConditionExpression: 'gsi2pk = :pk AND begins_with(gsi2sk, :state)',
            ExpressionAttributeValues: {
                ':pk': 'ENTITY#PHOTO',
                ':state': 'STATE#1'
            },
            Limit: lim,
            ...(startkey ? {
                ExclusiveStartKey: { 
                    pk: `USER#${startkey.split('-')[0]}`, 
                    sk: `PHOTO#${startkey.split('-')[1]}`, 
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
    async transform( photo: TransformationsPhotoDtos ): Promise<Buffer<ArrayBufferLike>>{
        const params = {
            Bucket: 'bucket-serverless-github-challenge',
            Key: `${photo.userid}/${photo.photoid}`
        };

        const response = await s3Client.send(new GetObjectCommand(params));
        if (response.$metadata.httpStatusCode !== 200) throw CustomError.badRequest("No se pudo obtener la imagen");
        
        const buffer = await streamToBuffer(response.Body as Readable);
        if (!buffer) throw CustomError.badRequest("No se pudo obtener la imagen");

        const imagebuffer = (await new PhotoTransformer(buffer).applyAll(photo)).getBuffer();
        if (!imagebuffer) throw CustomError.badRequest("No se pudo obtener la imagen");

  
        return imagebuffer
    }
}