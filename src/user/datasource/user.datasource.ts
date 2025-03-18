import { dynamoDb, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '../../data/Dynamodb/dynamodb';
import { UserEntity } from '../entity/user';
import { User } from '../types/user.type';


export class UserDatasources {

    constructor(
        private readonly tableName = process.env.ROL_TABLE,
    ){}

    async post(user: User): Promise<boolean> {
        const params = {
            TableName: 'Rol',
            Item: {
                pk: `ENTITY#USER`,
                sk: `USER#${user.id}`,

                gsi1pk: 'ENTITY#USER',
                gsi1sk: 'STATE#1',

                gsi2pk: 'STATE#1',
                gsi2sk: `USER#${user.email}`,

                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                rol: user.rol,
                state: 1,
                _createdAt: new Date().toISOString(),
                _updateAt: new Date().toISOString()
            },
            ConditionExpression: 'attribute_not_exists(pk)'
        };

        const respose = await dynamoDb.send(new PutCommand(params));
        return !!respose
    
    }
    async get(lim: number = 10, startkey?: string): Promise<UserEntity[]> {
        const params = {
            TableName: 'Rol',
            IndexName: 'GSI1',
            KeyConditionExpression: 'gsi1pk = :pk AND begins_with(gsi1sk, :statePrefix)',
            ExpressionAttributeValues: {
                ':pk': 'ENTITY#USER',
                ':statePrefix': 'STATE#1'
            },
            Limit: lim,
            ...(startkey ? {ExclusiveStartKey: { pk: 'ENTITY#USER', sk: `USER#${startkey}`, gsi1sk: 'STATE#1', gsi1pk: 'ENTITY#USER'}} : {})
            
        };
        const { Items, LastEvaluatedKey } = await dynamoDb.send(new QueryCommand(params));
        return Items!.map(user => UserEntity.fromObject(user));
    }
    async getById(id: string): Promise<UserEntity> {
        const params = {
            TableName: 'Rol',
            Key: { pk: 'ENTITY#USER', sk:`USER#${id}` }
        };
        const { Item } = await dynamoDb.send(new GetCommand(params));
        return UserEntity.fromObject(Item!);
        
    }
    async delete(id:string): Promise<boolean> {
         const params = {
            TableName: 'Rol',
            Key: { pk: 'ENTITY#USER', sk:`USER#${id}` },
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
            ConditionExpression: 'attribute_exists(pk)'
        };
        const response = await dynamoDb.send(new UpdateCommand(params));
        return !!response
    }

    
    async put(id:string, user:User): Promise<boolean> {
        return true
    }

}