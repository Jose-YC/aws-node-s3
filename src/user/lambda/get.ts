import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { PaginateDtos } from "../../DTO/paginate.dtos";
import { UserDatasources } from "../datasource/user.datasource";

export const handler = async (event: APIGatewayProxyEvent) => {
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