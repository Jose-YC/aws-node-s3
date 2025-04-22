import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { AuthDatasources } from "../datasource/auth.datasourse";
import { UserEntity } from "../../user/entity/user";

export const handler = async (event: APIGatewayProxyEvent) => {
  const { id, name, email, rol } = event.requestContext.authorizer!;
  if(!id) return formatErrorResponse(CustomError.badRequest('El id es requerido'));

  try {

    const token = await new AuthDatasources().renew(id)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        token,
        user: UserEntity.fromObject({id, name, email, rol}),
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