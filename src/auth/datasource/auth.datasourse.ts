import { AuthEntityDtos } from '../dtos/auth.entetity.dtos';
import { jwtAdapter } from '../../plugins/jwt.adapter';
import { LoginDtos } from '../dtos/login.dtos';
import { bcryptjsAdapter } from '../../plugins/bcryptjs.adapter';
import { RegisterDtos } from '../dtos/register.dtos';

import { dynamoDb, PutCommand, QueryCommand } from '../../data/Dynamodb/dynamodb';
import { CustomError } from '../../handler/errors/custom.error';
import { RolDatasources } from '../../rol/datasource/role.datasourse';


export class AuthDatasources {

    constructor(
        private readonly tableName = process.env.ROL_TABLE,
    ){}

    async login(login: LoginDtos): Promise<AuthEntityDtos> {
        
        const params = {
            TableName: 'Rol',
            IndexName: 'GSI2', // Nombre del índice secundario global
            KeyConditionExpression: 'gsi2pk = :state AND gsi2sk = :email',
            ExpressionAttributeValues: {
              ':state': 'STATE#1',
              ':email': `USER#${login.email}`
            },
            Limit: 1
          };

        const { Items } = await dynamoDb.send(new QueryCommand(params));
        if (!Items || Items.length !== 1) console.log('no existe user');

        const validPasword = bcryptjsAdapter.compare(login.password, Items![0].password);
        if (!validPasword) console.log('Usuario o contraseña incorrectos');

        const token = await jwtAdapter.generatetJWT<string>({id: Items![0].id});
        if (!token) console.log('Error al crear token');

          return AuthEntityDtos.fromObject({user: Items![0], token});
    }
    async register(register:RegisterDtos): Promise<AuthEntityDtos> {

        await new RolDatasources().getById('user')

        const params = { 
            TableName: 'Rol',
            IndexName: 'GSI2', // Nombre del índice secundario global
            KeyConditionExpression: 'gsi2pk = :state AND gsi2sk = :email',
            ExpressionAttributeValues: {
              ':state': 'STATE#1',
              ':email': register.email
            },
            Limit: 1
          };

        const { Items } = await dynamoDb.send(new QueryCommand(params));
        if (Items) CustomError.badRequest('El usuario ya existe'); 

        const password = bcryptjsAdapter.hash(register.password);
        const paramsCreateUser = {
            TableName: 'Rol',
            Item: {
                pk: `ENTITY#USER`,
                sk: `USER#${register.id}`,

                gsi1pk: 'ENTITY#USER',
                gsi1sk: 'STATE#1',

                gsi2pk: 'STATE#1',
                gsi2sk: `USER#${register.email}`,

                id: register.id,
                name: register.name,
                email: register.email,
                password: password,
                rol: 'user',
                state: 1,
                _createdAt: new Date().toISOString(),
                _updateAt: new Date().toISOString()
            },
            ConditionExpression: 'attribute_not_exists(pk)'
        };

        const respose = await dynamoDb.send(new PutCommand(paramsCreateUser));
        if (respose.$metadata.httpStatusCode !== 200) CustomError.badRequest('No se pudo guardar el usuario');

        const token = await jwtAdapter.generatetJWT<string>({id: register.id});

        return AuthEntityDtos.fromObject({user: register, token});
    }
    async renew(id:string): Promise<String> {
        const token = await jwtAdapter.generatetJWT<string>({id});
        if (!token) CustomError.badRequest( 'fallo la creacion de jwt');
        return token!;
    }
}