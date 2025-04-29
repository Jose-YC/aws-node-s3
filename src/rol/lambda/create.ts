import { APIGatewayProxyEvent } from "aws-lambda";
import { CustomError, formatErrorResponse } from "../../handler";
import { RolDatasources } from "../datasource/role.datasourse";
import { CreateRolDtos } from "../dtos/create.rol.dtos";
import { useMiddlewares } from '../../middleware/useMiddlewares';

export const handler = async ( event: APIGatewayProxyEvent )=> {
  const { name, description } = JSON.parse(event.body!);
  const [ err, createRolDtos ] = CreateRolDtos.create({name, description});
  if (err) return formatErrorResponse(CustomError.badRequest(err)); 
  
  try {

    await new RolDatasources().post(createRolDtos!);
    return {
      headers: {'Content-Type': 'application/json'},
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }

};

// export const handler = useMiddlewares({
//                         handler: create, 
//                         middlewares: [
                          
//                         ]
//                       });