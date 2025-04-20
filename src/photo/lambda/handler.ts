import { ulid } from 'ulid';
import { APIGatewayProxyEvent, S3Event } from 'aws-lambda';
import { PhotoDatasources } from '../datasource/photo.datasource';
import { formatErrorResponse } from '../../handler/error.handler';
import { CustomError } from '../../handler/errors/custom.error';
import { PhotoDtos } from '../dtos/update.phoo.dtos';
import { PhotoIdDtos } from '../dtos/id.photo.dtos';
import { PaginateDtos } from '../../DTO/paginate.dtos';

export const urlPhoto = async (event: APIGatewayProxyEvent, context)=> {
  const { id:userid } = event.requestContext.authorizer!;
  const [err, ids] = PhotoIdDtos.create({photoid:ulid(), userid});
  if (err) return formatErrorResponse(CustomError.badRequest(err));
  try {

     const url = await new PhotoDatasources().url(ids!);
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        url
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }

};
export const create = async (event: S3Event)=> {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key.split("/");

  try {
    await new PhotoDatasources().post({id: key[1], url: `https://${bucket}.s3.amazonaws.com/${key[0]}/${key[1]}`, userid: key[0]})
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }

};
export const getId = async (event: APIGatewayProxyEvent) => {
  const { lim = 5 , startkey } = event.queryStringParameters!;
  const { id } = event.requestContext.authorizer!;
  const [err, paginate] = PaginateDtos.create({lim, startkey, id});
  if (err) return formatErrorResponse(CustomError.badRequest(err));

  try {

    const photos = await new PhotoDatasources().getId(paginate!);

    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        photos,
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);    
  }
};
export const getAll = async (event: APIGatewayProxyEvent) => {
  const { lim = 5 , startkey } = event.queryStringParameters!;
  const [err, paginate] = PaginateDtos.create({lim, startkey});
  if (err) return formatErrorResponse(CustomError.badRequest(err));

  try {

    const photos = await new PhotoDatasources().getAll(paginate!);

    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        photos,
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);    
  }
};
export const getById = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body!);
  const { photoid } = event.pathParameters!;
  const { id:userid } = event.requestContext.authorizer!;
  const [err, ids] = PhotoIdDtos.create({photoid, userid});
  if (err) return formatErrorResponse(CustomError.badRequest(err));
  try {

    const photo = await new PhotoDatasources().getById(ids!)
   
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        photo,
        body
      }),
    };    
  
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);      
  }
};
export const elimination = async (event: APIGatewayProxyEvent) => {
  const { photoid } = event.pathParameters!;
  const { id:userid } = event.requestContext.authorizer!;
  const [err, ids] = PhotoIdDtos.create({photoid, userid});
  if (err) return formatErrorResponse(CustomError.badRequest(err));
  try {
        const Status = await new PhotoDatasources().delete(ids!)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status
      }),
    };    
    
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }
  
};
export const transform = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body!);
  const { photoid } = event.pathParameters!;
  const { id } = event.requestContext.authorizer!;
  const [err, transformations] = PhotoDtos.create({photoid, userid: id, ...body.transformations});
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
