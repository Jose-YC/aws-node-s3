import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { PaginateDtos } from "../../DTO/paginate.dtos";
import { UserDatasources } from "../datasource/user.datasource";
import { useMiddlewares } from "../../middleware/useMiddlewares";
import { validateRol } from "../../authoraizer/middleware/rol.middleware";

export const get = async (event: APIGatewayProxyEvent) => {
  const { lim = 5 , startkey } = event.queryStringParameters!;
  const [err, paginate] = PaginateDtos.create({lim: +lim, startkey});
  if (err) return formatErrorResponse(CustomError.badRequest(err));

  try {

    const users = await new UserDatasources().get(paginate!);

    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        users
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
                        handler: get, 
                        middlewares: [
                          validateRol("admin"),
                        ]
                      });