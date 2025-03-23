
import { APIGatewayAuthorizerResult, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "../Enum/enum";
import { CustomError } from "./errors/custom.error";

export const formatErrorResponse = (err: Error): APIGatewayProxyResult => {

    if (err instanceof CustomError) {
        return {
            statusCode: err.httpCode,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: false,
                errorType: err.name,
                message: err.message,
            })
        };
    }

    console.error('Error no controlado:', err);

    return {
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            success: false,
            errorType: 'INTERNAL SERVER ERROR',
            message: 'Error en el servidor',
        })
    };
};


export const generatePolicy = (principalId: string, effect: 'Allow' | 'Deny', resource: string, context = {}): APIGatewayAuthorizerResult => {
    return {
        principalId: principalId || 'userid',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
          }]
        },
        context: context
      };
};