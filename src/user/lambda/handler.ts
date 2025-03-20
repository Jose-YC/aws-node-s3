import { ulid } from 'ulid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { UserDatasources } from '../datasource/user.datasource';

export const create = async (event: APIGatewayProxyEvent, context)=> {

  const body = JSON.parse(event.body!);

  try {

    await new UserDatasources().post({ id: ulid(), name: body.name, password:  body.password, email:  body.email, rolName:  body.rol })
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
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
export const get = async (event: APIGatewayProxyEvent) => {
  const { lim = 5 , startkey } = event.queryStringParameters!;
  
  console.log("COOSTOM AUTHORAIZER",event.requestContext);

  try {

    const users = await new UserDatasources().get(+lim, startkey)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        users
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
export const getById = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters!;

  try {

    const user = await new UserDatasources().getById(id!)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        user
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
export const elimination = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters!;
  try {
    
    await new UserDatasources().delete(id!)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
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


export const update = async (event: APIGatewayProxyEvent) => {
  const { name } = event.pathParameters!;
  const body = JSON.parse(event.body!);

  // try {

  //   const role = await new RolDatasources().put(id!,{id, name:body.name, description: body.description})
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({
  //       Status: true,
  //       role
  //     }),
  //   };    
  
  // } catch (error) {

  //   console.log(error)
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({
  //       Status: false,
  //     }),
  //   };   

  // }
};