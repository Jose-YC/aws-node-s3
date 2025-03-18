import { ulid } from 'ulid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { RolDatasources } from '../datasource/role.datasourse';

export const create = async (event: APIGatewayProxyEvent, context)=> {

  const body = JSON.parse(event.body!);

  try {

    await new RolDatasources().post({ id: ulid(), name: body.name })
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

  try {

    const role = await new RolDatasources().get(+lim, startkey)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        role
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
  const { name } = event.pathParameters!;

  try {

    const role = await new RolDatasources().getById(name!)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        role
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
export const elimination = async (event) => {
  const { name } = event.pathParameters!;
  try {

    const role = await new RolDatasources().delete(name)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        role
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