import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { RolDatasources } from "../datasource/role.datasourse";

export const handler = async (event: APIGatewayProxyEvent) => {
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