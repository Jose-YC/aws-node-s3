import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CustomError } from "../../handler";

 /**
   * @param roles - Los roles que se van a validar
   */

export const validateRol = (...roles:string[]) => {
    return async (
        event: APIGatewayProxyEvent, 
        context: Context, 
        next: () => Promise<APIGatewayProxyResult>
    ): Promise<APIGatewayProxyResult> => {
        console.log("EVENTO", event);
        console.log("CONTEXTO", context);
        console.log("FUNCION NEXT", next);
        console.log("ROLES A VALIDAR", roles);
        const { rol } = event.requestContext.authorizer!;

        if ( !rol ) throw CustomError.unAuthorized('Token invalido');
        if ( !roles.includes( rol ) ) throw CustomError.unAuthorized('Falta de Permisos');

        return await next();
    }
  };