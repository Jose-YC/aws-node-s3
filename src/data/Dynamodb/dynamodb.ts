import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, 
         ScanCommand, GetCommand, QueryCommand,
         UpdateCommand } from "@aws-sdk/lib-dynamodb";
import AWS from 'aws-sdk';

const s3Client = new S3Client({});

const client = new DynamoDBClient({
    // region: "local",
    // endpoint: "http://localhost:8000",
    // credentials: {
    //     accessKeyId: "6yv2un",
    //     secretAccessKey: "9o8qzk"
    // }
}); 
const dynamoDb = DynamoDBDocumentClient.from(client);

export { dynamoDb, PutCommand, ScanCommand,
         GetCommand, QueryCommand, UpdateCommand,
         s3Client, PutObjectCommand, GetObjectCommand,
         getSignedUrl };
