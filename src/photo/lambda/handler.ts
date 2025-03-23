import { ulid } from 'ulid';
import { APIGatewayProxyEvent, S3Event } from 'aws-lambda';
import { PhotoDatasources } from '../datasource/photo.datasource';
import { formatErrorResponse } from '../../handler/error.handler';

export const urlPhoto = async (event: APIGatewayProxyEvent, context)=> {
  const { id } = event.requestContext.authorizer!;
  try {

     const url = await new PhotoDatasources().url(id, ulid(), 'Image')
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

  try {

    const photos = await new PhotoDatasources().getId(id, +lim, startkey);

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

  try {

    const photos = await new PhotoDatasources().getAll(+lim, startkey);

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
  const { id } = event.requestContext.authorizer!;

  try {

    const photo = await new PhotoDatasources().getById(photoid!, id)
   
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
  const { id } = event.requestContext.authorizer!;

  try {
        const Status = await new PhotoDatasources().delete(photoid!, id)
    
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
