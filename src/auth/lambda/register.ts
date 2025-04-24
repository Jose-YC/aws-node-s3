import { ulid } from "ulid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { AuthDatasources } from "../datasource/auth.datasourse";
import { CustomError, formatErrorResponse } from "../../handler";
import { RegisterDtos } from "../dtos";

export const handler = async (event: APIGatewayProxyEvent) => {
    const {email, password, name} = JSON.parse(event.body!);
    const [err, registerDtos] = RegisterDtos.create({id: ulid(), email, password, name});
    if (err) return formatErrorResponse(CustomError.badRequest(err));
  try {

    const { user, token } = await new AuthDatasources().register(registerDtos!);
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        user,
        token
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