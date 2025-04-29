import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { PhotoIdDtos } from "../dtos";
import { PhotoDatasources } from "../datasource/photo.datasource";
import { useMiddlewares } from "../../middleware/useMiddlewares";
import { validateRol } from "../../authoraizer/middleware/rol.middleware";

export const getById = async (event: APIGatewayProxyEvent) => {

  const { photoid } = event.pathParameters!;
  const { id:userid } = event.requestContext.authorizer!;

  const [err, ids] = PhotoIdDtos.create({photoid, userid});
  if (err) return formatErrorResponse(CustomError.badRequest(err));
  
  try {

    const photo = await new PhotoDatasources().getById(ids!)
   
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        photo
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);      
  }
};

export const handler = useMiddlewares({
                        handler: getById, 
                        middlewares: [
                          validateRol("user", "admin"),
                        ]
                      });