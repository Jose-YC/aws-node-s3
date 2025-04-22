
import { APIGatewayProxyEvent } from 'aws-lambda';
import { PhotoDatasources } from '../datasource/photo.datasource';
import { formatErrorResponse, CustomError } from '../../handler';
import { PhotoDtos } from '../dtos';

export const transform = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body!);
  const { photoid } = event.pathParameters!;
  const { id:userid } = event.requestContext.authorizer!;

  const [err, transformations] = PhotoDtos.create({ids: {photoid, userid}, transformations:{...body.transformations}  });
  if (err) return formatErrorResponse(CustomError.badRequest(err));

  try {
      const image = await new PhotoDatasources().transform(transformations!)

      return {
        statusCode: 200,
        body: JSON.stringify({
          imageUrl: `data:image/jpeg;base64,${image.toString('base64')}`
        })
      };    
    
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }
  
};