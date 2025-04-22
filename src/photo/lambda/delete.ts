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
        const Status = await new PhotoDatasources().delete(ids!)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status
      }),
    };    
    
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }
  
};