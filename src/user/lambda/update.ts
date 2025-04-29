import { APIGatewayProxyEvent } from 'aws-lambda';
import { UpdateUserDtos } from '../dtos';
import { CustomError, formatErrorResponse } from '../../handler';
import { bcryptjsAdapter } from '../../plugins';
import { UserDatasources } from '../datasource/user.datasource';
import { useMiddlewares } from "../../middleware/useMiddlewares";
import { validateRol } from "../../authoraizer/middleware/rol.middleware";

export const update = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters!;
  const { name, password } = JSON.parse(event.body!);

    const [error, updateUserDto] = UpdateUserDtos.create({ id, name, password});
    if (error) return formatErrorResponse( CustomError.badRequest(error));

    updateUserDto!.password = updateUserDto!.password ? bcryptjsAdapter.hash(updateUserDto!.password) : undefined;

  try {

    await new UserDatasources().put(updateUserDto!);
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true
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


export const handler = useMiddlewares({
                        handler: update, 
                        middlewares: [
                          validateRol("admin"),
                        ]
                      });