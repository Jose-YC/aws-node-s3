import { APIGatewayProxyResult } from 'aws-lambda';
import { OptionsMiddleware, OptionsReturnMiddleware } from '../types/types';
import { formatErrorResponse } from '../handler';
  
  /**
   * Aplica middlewares al handler de Lambda en orden secuencial
   * @param handler - Handler principal de Lambda
   * @param middlewares - Array de middlewares a aplicar (se ejecutan en el orden especificado)
   * @param callback - Función callback de Lambda (opcional)
   */
  export const useMiddlewares = (op: OptionsMiddleware) => {

    return async (options: OptionsReturnMiddleware): Promise<APIGatewayProxyResult> => {
      try {

        let index = 0;
        
        const executeMiddleware = async (): Promise<APIGatewayProxyResult> => {
          if (index === op.middlewares.length) return await op.handler(options.event, options.context, options.callback);
          const currentMiddleware = op.middlewares[index++];
          return await currentMiddleware(options.event, options.context, executeMiddleware);
        };
        
        return await executeMiddleware();

      } catch (error) {
        return formatErrorResponse(error);   
      }
    };
  };




