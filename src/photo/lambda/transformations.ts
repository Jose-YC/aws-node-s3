
import { ulid } from 'ulid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { PhotoDatasources } from '../datasource/photo.datasource';
import { formatErrorResponse, CustomError } from '../../handler';
import { PhotoDtos } from '../dtos';
import { PutObjectCommand, s3Client } from '../../data/Dynamodb/dynamodb';
import { useMiddlewares } from '../../middleware/useMiddlewares';
import { validateRol } from '../../authoraizer/middleware/rol.middleware';

export const transformations = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body!);
  const { photoid } = event.pathParameters!;
  const { id:userid } = event.requestContext.authorizer!;

  const [err, transformations] = PhotoDtos.create({ids: {photoid, userid}, transformations:{...body.transformations}  });
  if (err) return formatErrorResponse(CustomError.badRequest(err));

  
  try {
    const {imagebuffer:image, type } = await new PhotoDatasources().transform(transformations!);
    const bucket = process.env.BUCKET
    const key = `${userid}/${ulid()}.${type}`;

      const uploadParams = {
        Bucket: bucket,
        Key: key,
        Body: image,
        ContentType: `image/${type}`,
      };  

      await s3Client.send(new PutObjectCommand(uploadParams));

      return {
        statusCode: 200,
        body: JSON.stringify({
          imageUrl: `https://${bucket}.s3.amazonaws.com/${key}`,
        })
      };    
    
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }
  
};

export const handler = useMiddlewares({
                        handler: transformations, 
                        middlewares: [
                          validateRol("user", "admin"),
                        ]
                      });