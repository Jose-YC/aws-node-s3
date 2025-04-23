import { S3Event } from "aws-lambda";
import { PhotoDatasources } from "../datasource/photo.datasource";
import { CustomError, formatErrorResponse } from "../../handler";
import { CreatePhotoDtos } from "../dtos/create.photo.dtos";

export const handler = async (event: S3Event)=> {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key.split("/");
  const imageType = key[1].split('.');

  if (!imageType) return formatErrorResponse(CustomError.badRequest("Invalid file type."));
  if (!["jpg", "jpeg", "png", "web"].includes(imageType[1].toLowerCase())) return formatErrorResponse(CustomError.badRequest("Invalid file type"));

  const url = `https://${bucket}.s3.amazonaws.com/${key[0]}/${key[1]}`;

  const [ err, createPhotoDtos ] = CreatePhotoDtos.create({id: imageType[0], url, type:imageType[1], userid: key[0]});
  if (err) return formatErrorResponse(CustomError.badRequest(err)); 

  try {
    await new PhotoDatasources().post(createPhotoDtos!);
  } catch (error) {
    console.log(error)
    return formatErrorResponse(error);   
  }

};