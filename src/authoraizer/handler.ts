import { APIGatewayProxyEvent } from 'aws-lambda';


export const create = async (event: APIGatewayProxyEvent, context)=> {

  

  try {

    // await new RolDatasources().post({ id: ulid(), name: body.name, description:  body.description })
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