import { 
    APIGatewayProxyEvent, 
    APIGatewayProxyResult, 
    Context, Callback, Handler
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

  export type OptionsReturnMiddleware = {
    event: APIGatewayProxyEvent,
    context: Context,
    callback:Callback
  };