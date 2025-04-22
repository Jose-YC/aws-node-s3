import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { UpdateRolDtos } from "../dtos/update.rol.dtos";
import { RolDatasources } from "../datasource/role.datasourse";

export const handler = async (event: APIGatewayProxyEvent) => {
  const { name } = event.pathParameters!;
  const { description } = JSON.parse(event.body!);

  const [error, updateDto] = UpdateRolDtos.create({ name, description});
  if (error) return formatErrorResponse( CustomError.badRequest(error));

  try {
    
    await new RolDatasources().put(updateDto!);
    return {
      headers: {'Content-Type': 'application/json'},
      statusCode: 200,
      body: JSON.stringify({
        Status: true
      }),
    };    

  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);     
  }
};