import { ulid } from 'ulid';
import { APIGatewayProxyEvent, S3Event } from 'aws-lambda';
import { PhotoDatasources } from '../datasource/photo.datasource';

export const urlPhoto = async (event: APIGatewayProxyEvent, context)=> {

  const body = JSON.parse(event.body!);

  try {

     const url = await new PhotoDatasources().url('USER', ulid(), 'Image')
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        url
      }),
    };    
  
  } catch (error) {

    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        Status: false,
      }),
    };   

  }

};

export const create = async (event: S3Event)=> {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key.split("/");

  try {
    await new PhotoDatasources().post({id: key[1], url: `https://${bucket}.s3.amazonaws.com/${key[0]}/${key[1]}`, userid: key[0]})
  } catch (error) {
    console.log(error)
  }

};
export const get = async (event: APIGatewayProxyEvent) => {
  const { lim = 5 , startkey } = event.queryStringParameters!;
  const body = JSON.parse(event.body!);

  try {
          const photos = await new PhotoDatasources().get('user',+lim, startkey)
      
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: true,
        photos,
        body
      }),
    };    
  
  } catch (error) {

    console.log(error)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: false,
      }),
    };   

  }
};
export const getById = async (event: APIGatewayProxyEvent) => {
  const body = JSON.parse(event.body!);
  const { photoid } = event.pathParameters!;

  try {

    const photo = await new PhotoDatasources().getById(photoid!,'user')
   
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
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: false,
      }),
    };   

  }
};
export const elimination = async (event: APIGatewayProxyEvent) => {
  const { photoid } = event.pathParameters!;
  const body = JSON.parse(event.body!);

  try {
        const Status = await new PhotoDatasources().delete(photoid!, 'user')
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status,
        body
      }),
    };    
    
  } catch (error) {
    
    console.log(error)
    return {
      statusCode: 200,
      body: JSON.stringify({
        Status: false,
      }),
    };   
    
  }
  
};


export const update = async (event: APIGatewayProxyEvent) => {
  const { name } = event.pathParameters!;
  const body = JSON.parse(event.body!);

  // try {

  //   const role = await new RolDatasources().put(id!,{id, name:body.name, description: body.description})
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({
  //       Status: true,
  //       role
  //     }),
  //   };    
  
  // } catch (error) {

  //   console.log(error)
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({
  //       Status: false,
  //     }),
  //   };   

  // }
};