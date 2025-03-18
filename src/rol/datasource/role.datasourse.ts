
import { RolEntity } from '../entity/rol';
import { dynamoDb, PutCommand, 
         GetCommand, QueryCommand, UpdateCommand } from '../../data/Dynamodb/dynamodb';
import { CreateRolDtos } from '../dtos/create.rol.dtos';


export class RolDatasources {

    constructor(
        private readonly tableName = process.env.ROL_TABLE,
    ){}

    async post(rol: CreateRolDtos): Promise<boolean> {
        
        const params = {
            TableName: 'Rol',
            Item: {
                pk: 'ENTITY#ROL',
                sk: `ROL#${rol.name}`,

                gsi1pk: 'ENTITY#ROL',
                gsi1sk: 'STATE#1',

                id: rol.id,
                name: rol.name,
                state: 1,
                _createdAt: new Date().toISOString(),
                _updateAt: new Date().toISOString()
            },
            ConditionExpression: 'attribute_not_exists(pk)'
        };

        const role = await dynamoDb.send(new PutCommand(params));
        return !!role
    }
    async get(lim: number = 10, startkey?: string): Promise<RolEntity[]> {

        const params = {
            TableName: 'Rol',
            IndexName: 'GSI1',
            KeyConditionExpression: 'gsi1pk = :pk AND begins_with(gsi1sk, :statePrefix)',
            ExpressionAttributeValues: {
                ':pk': 'ENTITY#ROL',
                ':statePrefix': 'STATE#1'
            },
            Limit: lim,
            ...(startkey ? {ExclusiveStartKey: { pk: 'ENTITY#ROL', sk: `ROL#${startkey}`, gsi1sk: 'STATE#1', gsi1pk: 'ENTITY#ROL'}} : {})
           
        };
        const { Items, LastEvaluatedKey } = await dynamoDb.send(new QueryCommand(params));
        console.log(LastEvaluatedKey)
        return Items!.map(rol => RolEntity.fromObject(rol));
    }
    async getById(name:string): Promise<RolEntity> {
        const params = {
            TableName: 'Rol',
            Key: { pk: 'ENTITY#ROL', sk:`ROL#${name}` }
        };
        const response = await dynamoDb.send(new GetCommand(params));
        return RolEntity.fromObject(response.Item!);
    }
    async delete(name:string): Promise<boolean> {
        const params = {
            TableName: 'Rol',
            Key: { pk: 'ENTITY#ROL', sk:`ROL#${name}` },
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


    
    async put(id:string, name:string, ): Promise<boolean> {
        const params = {
            TableName: 'Rol',
            Key: { id },
            // UpdateExpression: 'SET #name = :name, updatedAt = :updatedAt',
            UpdateExpression: 'SET #name = :name',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': 'rol.name',
                // ':updatedAt': timestamp
            },
            ConditionExpression: 'attribute_not_exists(pk)'
        };
        const response = await dynamoDb.send(new UpdateCommand(params));
        console.log(response);

        return !!response
    }
}