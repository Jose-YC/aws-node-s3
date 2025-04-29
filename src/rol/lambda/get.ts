import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { PaginateDtos } from "../../DTO/paginate.dtos";
import { RolDatasources } from "../datasource/role.datasourse";
import { useMiddlewares } from "../../middleware/useMiddlewares";
import { validateRol } from "../../authoraizer/middleware/rol.middleware";

export const get = async (event: APIGatewayProxyEvent) => {
  const { lim=5, startkey } = event.queryStringParameters!;
  const [err, paginate] = PaginateDtos.create({lim: +lim, startkey});
  if (err) return formatErrorResponse(CustomError.badRequest(err));

  try {
    const role = await new RolDatasources().get(paginate!);
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
                        handler: get, 
                        middlewares: [
                          validateRol("admin"),
                        ]
                      });