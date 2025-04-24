import { APIGatewayProxyEvent } from "aws-lambda";
import { AuthDatasources } from "../datasource/auth.datasourse";
import { CustomError, formatErrorResponse } from "../../handler";
import { LoginDtos } from "../dtos";

export const handler = async (event: APIGatewayProxyEvent, context)=> {

  const {email, password} = JSON.parse(event.body!);
  
  const [err, loginDtos] = LoginDtos.create({email, password});
  if (err) return formatErrorResponse(CustomError.badRequest(err)); 
  

  try {

   const {user, token} = await new AuthDatasources().login(loginDtos!);
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