import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult  } from 'aws-lambda';
import { jwtAdapter } from '../plugins/jwt.adapter';
import { UserDatasources } from '../user/datasource/user.datasource';
import { generatePolicy } from '../handler/error.handler';


export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult >=> {

  const xtoken = event.authorizationToken;
  if (!xtoken) return generatePolicy('unauthorized','Deny', event.methodArn);
  
  const token = xtoken.startsWith('Bearer ') ? xtoken.slice(7) : xtoken;
  
  try {
    const payload = await jwtAdapter.validatetetJWT<{id:string}>(token);
    if (!payload) return generatePolicy('unauthorized','Deny', event.methodArn);
    
    const user = await new UserDatasources().getById(payload.id);
    if (!user) return generatePolicy('unauthorized', 'Deny',  event.methodArn);
    
    return generatePolicy(user.id,'Allow', event.methodArn, { name: user.name, id: user.id, email: user.email, rol: user.rol });

  } catch (error) {
    console.log(error);
    return generatePolicy('unauthorized', 'Deny', event.methodArn);
  }

};