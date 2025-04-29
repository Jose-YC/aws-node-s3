import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { UserDatasources } from "../datasource/user.datasource";
import { useMiddlewares } from "../../middleware/useMiddlewares";
import { validateRol } from "../../authoraizer/middleware/rol.middleware";

export const getById = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters!;
  if (!id) return formatErrorResponse(CustomError.badRequest("El id es requerido"));

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


export const handler = useMiddlewares({
                        handler: getById, 
                        middlewares: [
                          validateRol("admin"),
                        ]
                      });