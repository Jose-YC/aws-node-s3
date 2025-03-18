import { Photo } from '../types/photo.type';
import { dynamoDb, PutCommand, GetCommand, 
         QueryCommand, UpdateCommand, PutObjectCommand, 
         getSignedUrl, s3Client} from '../../data/Dynamodb/dynamodb';

export class PhotoDatasources {

    async url(userid:string, photoid:string, contentType:string): Promise<String> {

        const key = `${userid}/${photoid}`;

        const command = new PutObjectCommand({
            Bucket: 'bucket-serverless-github-challenge',
            Key: key,
            ContentType: contentType
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return uploadUrl    
    }
   
    async post(photo: Photo): Promise<boolean> {
        const params = {
            TableName: 'Rol',
            Item: {
                pk: `USER#${photo.userid}`,
                sk: `PHOTO#${photo.id}`,

                gsi1pk: 'ENTITY#PHOTO',
                gsi1sk: 'STATE#1',

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

    async getById(photoid: string, userid:string) {
        const params = {
            TableName: 'Rol',
            Key: { pk: `USER#${userid}`, sk: `PHOTO#${photoid}` }
        };
        const response = await dynamoDb.send(new GetCommand(params));
        return response;
    }
    async delete(photoid:string, userid: string): Promise<boolean> {
        const params = {
            TableName: 'Rol',
            Key: { pk: `USER#${userid}`, sk:`PHOTO#${photoid}` },
            UpdateExpression: 'SET #gsi1sk = :newStateIndex, #state = :newState',
            ExpressionAttributeNames: {
                '#gsi1sk': 'gsi1sk',
                '#state': 'state'
            },
            ExpressionAttributeValues: {
            ':newStateIndex': 'STATE#0',  // 0 para inactivo, 1 para activo
            ':newState': 0  // 0 para inactivo, 1 para activo
            },
            ConditionExpression: 'attribute_exists(pk)'
        };
        const response = await dynamoDb.send(new UpdateCommand(params));
        
        return !!response
    }
    

    async get( userid: string, lim: number, startkey?: string) {
        const params = {
            TableName: 'Rol',
            IndexName: 'GSI1',
            KeyConditionExpression: 'gsi1pk = :pk AND begins_with(gsi1sk, :statePrefix)',
            ExpressionAttributeValues: {
                ':pk': 'ENTITY#PHOTO',
                ':statePrefix': 'STATE#1'
            },
            Limit: lim,
            ...(startkey ? {ExclusiveStartKey: { pk: `USER#${userid}`, sk: `PHOTO#${startkey}`, gsi1sk: 'STATE#1', gsi1pk: 'ENTITY#PHOTO'}} : {})
           
        };

        const { Items, LastEvaluatedKey } = await dynamoDb.send(new QueryCommand(params));
        console.log(LastEvaluatedKey);
        console.log(Items);

        return LastEvaluatedKey
    }

    
    async search(lim: number, userid: string, search: string, startkey?: string) {
       
    }
    async put(id:string, product:Photo): Promise<boolean> {
        return true
    }
}