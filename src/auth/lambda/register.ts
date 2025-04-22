import { ulid } from "ulid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { AuthDatasources } from "../datasource/auth.datasourse";

export const handler = async (event: APIGatewayProxyEvent) => {
    const {email, password, name} = JSON.parse(event.body!);

  try {

    const { user, token } = await new AuthDatasources().register({ id: ulid(), email, password, name})
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