import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from 'aws-lambda';
import { OptionsMiddleware } from '../types/types';
import { formatErrorResponse } from '../handler';
  
  /**
   * Aplica middlewares al handler de Lambda en orden secuencial
   * @param handler - Handler principal de Lambda
   * @param middlewares - Array de middlewares a aplicar (se ejecutan en el orden especificado)
   * @param callback - Función callback de Lambda (opcional)
   */
  export const useMiddlewares = (op: OptionsMiddleware) => {

    return async (event: APIGatewayProxyEvent, context: Context, callback:Callback): Promise<APIGatewayProxyResult> => {
      console.log("EVENTO DEL PATRON", event);
        console.log("CONTEXTO DEL PATRON", context);
        console.log("FUNCION NEXT DEL PATRON", callback);
      try {

        let index = 0;
        
        const executeMiddleware = async (): Promise<APIGatewayProxyResult> => {
          if (index === op.middlewares.length) return await op.handler(event, context, callback);
          const currentMiddleware = op.middlewares[index++];
          return await currentMiddleware(event, context, executeMiddleware);
        };
        
        return await executeMiddleware();

      } catch (error) {
        console.error('Error en el middleware:', error);
        return formatErrorResponse(error);   
      }
    };
  };




