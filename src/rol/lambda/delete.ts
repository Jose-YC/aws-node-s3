import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { RolDatasources } from "../datasource/role.datasourse";
import { useMiddlewares } from "../../middleware/useMiddlewares";
import { validateRol } from "../../authoraizer/middleware/rol.middleware";

export const elimination = async (event: APIGatewayProxyEvent) => {
  const { name } = event.pathParameters!;
  if (!name) return formatErrorResponse(CustomError.badRequest("El name es requerido"));

  try {
    const role = await new RolDatasources().delete(name)
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

export const handler = useMiddlewares({
                        handler: elimination, 
                        middlewares: [
                          validateRol("admin"),
                        ]
                      });