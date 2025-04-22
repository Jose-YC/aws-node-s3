import { ulid } from "ulid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { PhotoIdDtos } from "../dtos";
import { PhotoDatasources } from "../datasource/photo.datasource";

export const handler = async (event: APIGatewayProxyEvent)=> {
  const { id:userid } = event.requestContext.authorizer!;

  const [err, ids] = PhotoIdDtos.create({photoid:ulid(), userid});
  if (err) return formatErrorResponse(CustomError.badRequest(err));
  
  try {

     const url = await new PhotoDatasources().url(ids!);
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