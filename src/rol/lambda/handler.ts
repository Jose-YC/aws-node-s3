import { APIGatewayProxyEvent } from 'aws-lambda';
import { RolDatasources } from '../datasource/role.datasourse';
import { formatErrorResponse } from '../../handler/error.handler';
import { UpdateRolDtos } from '../dtos/update.rol.dtos';
import { CustomError } from '../../handler/errors/custom.error';
import { PaginateDtos } from '../../DTO/paginate.dtos';

export const create = async (event: APIGatewayProxyEvent, context)=> {

  const { name, description } = JSON.parse(event.body!);

  try {

    await new RolDatasources().post({ name, description })
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
  const { lim=5, startkey } = event.queryStringParameters!;
    const [err, paginate] = PaginateDtos.create({lim: +lim, startkey});
    if (err) return formatErrorResponse(CustomError.badRequest(err));

  try {

    const role = await new RolDatasources().get(paginate!);

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
  if (!name) return formatErrorResponse(CustomError.badRequest("El name es requerido"))
  
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
  if (!name) return formatErrorResponse(CustomError.badRequest("El name es requerido"));
  const { description } = JSON.parse(event.body!);
  if (!description) return formatErrorResponse(CustomError.badRequest("La description es requerida"));

  const [error, updateDto] = UpdateRolDtos.create({ name, description});
  if (error) return formatErrorResponse( CustomError.badRequest(error));

  try {
    
    await new RolDatasources().put(updateDto!);
    return {
      headers: {'Content-Type': 'application/json'},
      statusCode: 200,
      body: JSON.stringify({
        Status: true
      }),
    };    

  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);     
  }
};
export const elimination = async (event) => {
  const { name } = event.pathParameters!;
  if (!name) return formatErrorResponse(CustomError.badRequest("El name es requerido"));


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