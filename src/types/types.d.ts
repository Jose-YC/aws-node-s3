import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context, Handler
  } from 'aws-lambda';

 // Tipo para middleware
  export type Middleware = () => (
    event: APIGatewayProxyEvent,
    context: Context,
    next: () => Promise<APIGatewayProxyResult>
  ) => Promise<APIGatewayProxyResult>;

  export type OptionsMiddleware = {
    handler: Handler, 
    middlewares: ReturnType<Middleware>[], 
  };