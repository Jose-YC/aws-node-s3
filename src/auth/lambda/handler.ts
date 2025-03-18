import { ulid } from 'ulid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AuthDatasources } from '../datasource/auth.datasourse';

export const login = async (event: APIGatewayProxyEvent, context)=> {

  const body = JSON.parse(event.body!);

  try {

   const {user, token} = await new AuthDatasources().login({ email: body.email, password:  body.password })
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

  try {

    const token = await new AuthDatasources().renew('token provar')
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