# AWS Node.js S3 & DynamoDB Serverless Project (Image transformation)

A serverless framework project using Node.js and TypeScript that implements APIs with AWS Lambda, API Gateway, S3, and DynamoDB.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [Deployed Endpoints](#deployed-endpoints)
- [Layers](#layers)


## Overview

This project provides a serverless implementation for managing files in S3 and data in DynamoDB using AWS Lambda and API Gateway. It's built with TypeScript and uses the Serverless Framework for deployment and local development.

## Features

- File upload to S3 with pre-signed URLs
- Image processing with Sharp
- DynamoDB integration for data storage
- Authentication with JWT
- Layered architecture for optimized Lambda functions

## Prerequisites

- Node.js (v18 or higher)
- AWS CLI configured with appropriate credentials
- Serverless Framework installed globally (`npm install -g serverless`)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Jose-YC/aws-node-s3.git
   ```

2. Navigate to the project directory:
   ```
   cd aws-node-s3
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Project Structure

```
aws-node-s3/
├── serverless.yml        # Serverless configuration
├── src/                  # Source code
│   ├── model/            
│   │    ├── datasource/  # Business logic
│   │    ├── dtos/        # Data Transfer Object
│   │    └── lambda/      # Lambda function handlers
│   ├── data/             # Connection to the database
│   ├── DTO/              # Data Transfer Object
│   ├── Enum/             # Enumerations TypeScript
│   ├── handler/          
│   ├── middleware/       
│   └── plugins/          
│   
└── nodejs/             # Lambda layer directory
```

## Usage

### Deployment

Deploy the service to AWS:

```
sls deploy
```

To remove the deployed service:

```
sls remove
```

## Available Scripts

- `npm run deploy:dev`: Deploy the service development environment on AWS
- `npm run remove:dev`: Remove the dev environment from the deployed AWS service
- `npm run layer`: Create a Lambda layer for Node.js dependencies

## Deployed Endpoints


You can see more details about the endpoints at: https://documenter.getpostman.com/view/29992084/2sB2ixkEdp

When deployed, the service exposes several endpoints:

```
POST /dev/auth/login 

{
   "email": string,
   "password": string
}   
```

```
GET /dev/auth/renew
```

```
POST /dev/auth/register 

{
    "name": string,
    "email": string,
    "password": string
}
```

```
POST /dev/user/create

{
    "name": string,
    "email": string,
    "password": string,
    "rol": string
}
```

```
GET /dev/user?lim&startkey
```

```
GET /dev/user/{id} 
```

```
DELETE /dev/user/delete/{id}  
```

```
GET /dev/rol?lim&startkey

```

```
PUT /dev/rol/update/{name} 

{
    "description": string
}
```

```
GET /dev/rol/{name} 
```

```
DELETE /dev/rol/delete/{name} 
```

```
POST /dev/rol/create 

{
    "name": string,
    "description": string

}
```

```
GET /dev/photo?lim&startkey
```

```
GET /dev/photo/all?lim&startkey
```

```
GET /dev/photo/{id} 
```

```
GET /dev/photo/url
```

```
POST /dev/photo/transform/{id}

{
  "transformations": {
    "resize": {
      "width": number,
      "height": number
    },
    "rotate": number,
    "filters": {
      "grayscale": booleano,
      "sepia": booleano
    }
  }
}
```

*Note: The actual endpoints may vary based on your serverless.yml configuration.*


## Layers

This project uses Lambda Layers to optimize deployment size and cold start times. The `npm run layer` script creates a layer with production dependencies.

The layer includes:
- AWS SDK clients for S3 and DynamoDB
- bcryptjs for password hashing
- jsonwebtoken for authentication
- sharp for image processing
- ulid for unique ID generation
