import { ulid } from "ulid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { PhotoIdDtos } from "../dtos";
import { PhotoDatasources } from "../datasource/photo.datasource";
import { useMiddlewares } from "../../middleware/useMiddlewares";
import { validateRol } from '../../authoraizer/middleware/rol.middleware';

export const urlPhoto = async (event: APIGatewayProxyEvent)=> {
  const { id:userid } = event.requestContext.authorizer!;
  const { contentType } = event.queryStringParameters!;

  if (!contentType) return formatErrorResponse(CustomError.badRequest("Missing contentType"));

  const [err, ids] = PhotoIdDtos.create({photoid:ulid(), userid});
  if (err) return formatErrorResponse(CustomError.badRequest(err));
  
  try {

     const url = await new PhotoDatasources().url(ids!, contentType);
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        url
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }

};

export const handler = useMiddlewares({
                        handler: urlPhoto, 
                        middlewares: [
                          validateRol("user", "admin"),
                        ]
                      });