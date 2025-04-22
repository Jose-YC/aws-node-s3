import { APIGatewayProxyEvent } from "aws-lambda";
import { PaginateDtos } from "../../DTO/paginate.dtos";
import { CustomError, formatErrorResponse } from "../../handler";
import { PhotoDatasources } from "../datasource/photo.datasource";

export const handler = async (event: APIGatewayProxyEvent) => {
  const { lim = 5 , startkey } = event.queryStringParameters!;
  const { id } = event.requestContext.authorizer!;
  
  const [err, paginate] = PaginateDtos.create({lim: +lim, startkey, id});
  if (err) return formatErrorResponse(CustomError.badRequest(err));

  try {

    const photos = await new PhotoDatasources().getId(paginate!);

    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        photos,
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);    
  }
};