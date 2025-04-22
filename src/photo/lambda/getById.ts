import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { PhotoIdDtos } from "../dtos";
import { PhotoDatasources } from "../datasource/photo.datasource";

export const handler = async (event: APIGatewayProxyEvent) => {

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