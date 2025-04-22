import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { UserDatasources } from "../datasource/user.datasource";

export const handler = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters!;
  if (!id) return formatErrorResponse(CustomError.badRequest("El id es requerido"));
  
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