import { APIGatewayProxyEvent } from "aws-lambda";
import { AuthDatasources } from "../datasource/auth.datasourse";

export const handler = async (event: APIGatewayProxyEvent, context)=> {

  const {email, password} = JSON.parse(event.body!);

  try {

   const {user, token} = await new AuthDatasources().login({ email, password })
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