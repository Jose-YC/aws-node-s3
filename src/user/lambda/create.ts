import { ulid } from "ulid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { UserDatasources } from "../datasource/user.datasource";
import { CreateUserDtos } from "../dtos/create.user.dtos";
import { useMiddlewares } from "../../middleware/useMiddlewares";
import { validateRol } from "../../authoraizer/middleware/rol.middleware";

export const create = async (event: APIGatewayProxyEvent)=> {

  const {name, email, password, rol} = JSON.parse(event.body!);

  const [ err, createUserDtos ] = CreateUserDtos.create({id: ulid(), name, email, password, rol});
    if (err) return formatErrorResponse(CustomError.badRequest(err)); 

  try {

    await new UserDatasources().post(createUserDtos!);
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
      }),
    };    
  
  } catch (error) {

    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        Status: false,
      }),
    };   

  }

};

export const handler = useMiddlewares({
                        handler: create, 
                        middlewares: [
                          validateRol("admin"),
                        ]
                      });