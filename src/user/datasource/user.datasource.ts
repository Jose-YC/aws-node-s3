import { dynamoDb, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '../../data/Dynamodb/dynamodb';

import { UserEntity } from '../entity/user';
import { CreateUserDtos } from '../dtos/create.user.dtos';
import { UpdateUserDtos } from '../dtos/update.user.dtos';
import { RolDatasources } from '../../rol/datasource/role.datasourse';
import { bcryptjsAdapter } from '../../plugins/bcryptjs.adapter';
import { CustomError } from '../../handler/errors/custom.error';
import { PaginateDtos } from '../../DTO/paginate.dtos';


export class UserDatasources {

    constructor(
        private readonly tableName = process.env.ROL_TABLE,
    ){}

    async post(user: CreateUserDtos): Promise<boolean> {

        await new RolDatasources().getById(user.rolName)

        const password = bcryptjsAdapter.hash(user.password);
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
                password,
                rol: user.rolName,
                state: 1,
                _createdAt: new Date().toISOString(),
                _updateAt: new Date().toISOString()
            },
            ConditionExpression: 'attribute_not_exists(pk)'
        };

        const respose = await dynamoDb.send(new PutCommand(params));
        if (respose.$metadata.httpStatusCode !== 200) throw CustomError.badRequest('Error al ingresar el usuario');
        
        return !!respose
    
    }
    async get(paginate: PaginateDtos): Promise<{items: UserEntity[], startkey?: string}> {

        const params = {
            TableName: 'Rol',
            IndexName: 'GSI1',
            KeyConditionExpression: 'gsi1pk = :pk AND begins_with(gsi1sk, :statePrefix)',
            ExpressionAttributeValues: {
                ':pk': 'ENTITY#USER',
                ':statePrefix': 'STATE#1'
            },
            Limit: paginate.lim,
            ...(paginate.startkey ? {ExclusiveStartKey: { pk: 'ENTITY#USER', sk: `USER#${paginate.startkey}`, gsi1sk: 'STATE#1', gsi1pk: 'ENTITY#USER'}} : {})
            
        };
        const { Items, LastEvaluatedKey } = await dynamoDb.send(new QueryCommand(params));

        return {
            items: Items!.map(user => UserEntity.fromObject(user)),
            startkey: LastEvaluatedKey?.sk.replace('ROL#', '')
        };
    }
    async getById(id: string): Promise<UserEntity> {
        const params = {
            TableName: 'Rol',
            Key: { pk: 'ENTITY#USER', sk:`USER#${id}` }
        };
        const { Item } = await dynamoDb.send(new GetCommand(params));
        if (!Item) throw CustomError.badRequest("No exite el usuario");

        return UserEntity.fromObject(Item!);
        
    }
    async delete(id:string): Promise<boolean> {
        this.getById(id);
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
            ConditionExpression: 'attribute_exists(pk) AND attribute_exists(sk)'
        };
        const response = await dynamoDb.send(new UpdateCommand(params));
        if (response.$metadata.httpStatusCode !== 200) throw CustomError.badRequest('Error al eliminar el rol');

        return !!response
    }
    async put(user: UpdateUserDtos): Promise<boolean> {
        const params = {
            TableName: 'Rol',
            Key: { pk: 'ENTITY#USER', sk:`USER#${user.id}` },
            UpdateExpression: user.expression,
            ExpressionAttributeNames: user.attributeNames,
            ExpressionAttributeValues: user.values,
            ConditionExpression: 'attribute_exists(pk) AND attribute_exists(sk)'
        };
        const response = await dynamoDb.send(new UpdateCommand(params));
        if (response.$metadata.httpStatusCode !== 200) throw CustomError.badRequest('Error al modificar el usuario');

        return !!response
    }

}