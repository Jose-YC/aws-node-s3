import { ulid } from 'ulid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { RolDatasources } from '../datasource/role.datasourse';
import { formatErrorResponse } from '../../handler/error.handler';
import { UpdateRolDtos } from '../dtos/update.rol.dtos';
import { CustomError } from '../../handler/errors/custom.error';

export const create = async (event: APIGatewayProxyEvent, context)=> {

  const body = JSON.parse(event.body!);

  try {

    await new RolDatasources().post({ id: ulid(), name: body.name })
    return {
      headers: {'Content-Type': 'application/json'},
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }

};
export const get = async (event: APIGatewayProxyEvent) => {
  const { lim = 5 , startkey } = event.queryStringParameters!;

  try {

    const role = await new RolDatasources().get(+lim, startkey)
    return {
      headers: {'Content-Type': 'application/json'},
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        role
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }
};
export const getById = async (event: APIGatewayProxyEvent) => {
  const { name } = event.pathParameters!;

  try {

    const role = await new RolDatasources().getById(name!)
    return {
      headers: {'Content-Type': 'application/json'},
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        role
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }
};
export const update = async (event: APIGatewayProxyEvent) => {
  const { name } = event.pathParameters!;
  const [error, updateDto] = UpdateRolDtos.create({ name });
  if (error) return formatErrorResponse( CustomError.badRequest(error))

  try {
    const role = await new RolDatasources().put(updateDto!)
    return {
      headers: {'Content-Type': 'application/json'},
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        role
      }),
    };    

  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);     
  }
};
export const elimination = async (event) => {
  const { name } = event.pathParameters!;
  try {

    const role = await new RolDatasources().delete(name)
    return {
      headers: {'Content-Type': 'application/json'},
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        role
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);      

  }
 
};