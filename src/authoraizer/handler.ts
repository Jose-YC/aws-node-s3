import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult  } from 'aws-lambda';
import { jwtAdapter } from '../plugins/jwt.adapter';
import { UserDatasources } from '../user/datasource/user.datasource';
import { generatePolicy } from '../handler/error.handler';


export const authorize = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult >=> {
  const xtoken = event.authorizationToken;
  if (!xtoken) return generatePolicy(
    'unauthorized',
    'Deny', 
    event.methodArn, 
    { 
      contex: { Status: false }, 
      statusCode: 401, 
      message: 'Token no valido' 
    }
  );
  
  const token = xtoken.startsWith('Bearer ') 
    ? event.authorizationToken.slice(7) 
    : event.authorizationToken;
    
  try {
    const payload = await jwtAdapter.validatetetJWT<{id:string}>(token);
    if (!payload) return generatePolicy(
      'unauthorized',
      'Deny', 
      event.methodArn, 
      { 
        contex: { Status: false }, 
        statusCode: 401, 
        message: 'Error de Token' 
      }
    );
    
    const user = await new UserDatasources().getById(payload.id);
    if (!user) return generatePolicy(
      'unauthorized',
      'Deny', 
      event.methodArn, 
      { 
        contex: { Status: false }, 
        statusCode: 401, 
        message: 'Error de Token' 
      }
    );

    
    return generatePolicy(user.id,'Allow', event.methodArn, { user });

  } catch (error) {
    console.log(error);
    return generatePolicy(
      'unauthorized',
      'Deny', 
      event.methodArn, 
      { 
        contex: { Status: false }, 
        statusCode: 500, 
        message: 'INTERNAL_SERVER_ERROR' 
      }
    );
  }

};