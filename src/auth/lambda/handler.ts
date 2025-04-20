import { ulid } from 'ulid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AuthDatasources } from '../datasource/auth.datasourse';
import { formatErrorResponse } from '../../handler/error.handler';
import { CustomError } from '../../handler/errors/custom.error';

export const login = async (event: APIGatewayProxyEvent, context)=> {

  const body = JSON.parse(event.body!);

  try {

   const {user, token} = await new AuthDatasources().login({ email: body.email, password:  body.password })
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Status: true,
        user,
        token
      }),
    };    
  
  } catch (error) {

    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        Status: false,
      }),
    };   

  }

};
export const register = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body!);

  try {

    const { user, token } = await new AuthDatasources().register({ id: ulid(),email: body.email, password: body.password, name: body.name})
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        user,
        token
      }),
    };    
  
  } catch (error) {

    console.log(error)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: false,
      }),
    };   

  }
};
export const renew = async (event: APIGatewayProxyEvent) => {
  const { id:userid } = event.requestContext.authorizer!;
  if(!userid) return formatErrorResponse(CustomError.badRequest('El id es requerido'));

  try {

    const token = await new AuthDatasources().renew(userid)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        token
      }),
    };    
  
  } catch (error) {

    console.log(error)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: false,
      }),
    };   

  }
};