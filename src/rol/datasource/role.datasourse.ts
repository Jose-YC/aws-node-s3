
import { RolEntity } from '../entity/rol';
import { dynamoDb, PutCommand, 
         GetCommand, QueryCommand, UpdateCommand } from '../../data/Dynamodb/dynamodb';
import { CreateRolDtos } from '../dtos/create.rol.dtos';
import { CustomError } from '../../handler/errors/custom.error';
import { UpdateRolDtos } from '../dtos/update.rol.dtos';
import { PaginateDtos } from '../../DTO/paginate.dtos';


export class RolDatasources {

    constructor(
        private readonly tableName = process.env.PHOTO_TABLE,
    ){}

    async post(rol: CreateRolDtos): Promise<boolean> {
        
        const params = {
            TableName: this.tableName,
            Item: {
                pk: 'ENTITY#ROL',
                sk: `ROL#${rol.name}`,

                gsi1pk: 'ENTITY#ROL',
                gsi1sk: 'STATE#1',

                name: rol.name,
                description: rol.description,
                state: 1,
                _createdAt: new Date().toISOString(),
                _updateAt: new Date().toISOString()
            },
            ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)'
        };

        const role = await dynamoDb.send(new PutCommand(params));
        if (role.$metadata.httpStatusCode !== 200) throw CustomError.badRequest('Error al ingresar el rol')

        return !!role
    }
    async get(paginate: PaginateDtos): Promise<{items: RolEntity[], startkey?: string}> {

        const params = {
            TableName: this.tableName,
            IndexName: 'GSI1',
            KeyConditionExpression: 'gsi1pk = :pk AND begins_with(gsi1sk, :statePrefix)',
            ExpressionAttributeValues: {
                ':pk': 'ENTITY#ROL',
                ':statePrefix': 'STATE#1'
            },
            Limit: paginate.lim,
            ...(paginate.startkey ? {ExclusiveStartKey: { pk: 'ENTITY#ROL', sk: `ROL#${paginate.startkey}`, gsi1sk: 'STATE#1', gsi1pk: 'ENTITY#ROL'}} : {})
           
        };
        const { Items, LastEvaluatedKey } = await dynamoDb.send(new QueryCommand(params));

        return {
            items: Items!.map(rol => RolEntity.fromObject(rol)),
            startkey: LastEvaluatedKey?.sk.replace('ROL#', '')
        };
    }
    async getById(name:string): Promise<RolEntity> {
        const params = {
            TableName: this.tableName,
            Key: { pk: 'ENTITY#ROL', sk:`ROL#${name}` }
        };
        const { Item } = await dynamoDb.send(new GetCommand(params));
        if (!Item) throw CustomError.badRequest("No exite el rol");

        return RolEntity.fromObject(Item!);
    }
    async delete(name:string): Promise<boolean> {
        this.getById(name);
        const params = {
            TableName: this.tableName,
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
            ConditionExpression: 'attribute_exists(pk) AND attribute_exists(sk)'
        };
        const response = await dynamoDb.send(new UpdateCommand(params));
        if (response.$metadata.httpStatusCode !== 200) throw CustomError.badRequest('Error al eliminar el rol');
        
        return !!response
    }
    async put(rol: UpdateRolDtos ): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: { pk: 'ENTITY#ROL', sk:`ROL#${rol.name}` },
            UpdateExpression: rol.expression,
            ExpressionAttributeNames: rol.attributeNames,
            ExpressionAttributeValues: rol.values,
            ConditionExpression: 'attribute_exists(pk) AND attribute_exists(sk)'
        };
        const response = await dynamoDb.send(new UpdateCommand(params));
        if (response.$metadata.httpStatusCode !== 200) throw CustomError.badRequest('Error al modificar el rol');

        return !!response
    }
}