# backend crud prject

this is a backend API built with Node.js, Express, TypeScript, and PostgreSQL. Prisma is used for database access, and the application runs in a Dockerized environment.

## technologies used

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Docker 
- Docker Compose
- AWS S3 (via LocalStack)
- JWT for authentication

## .env
   to run the application, a .env file containing environment variables is required.
   ```env
   PORT=3000
   DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database_name>?schema=public"
   JWT_SECRET=your_jwt_secret_here
   BUCKET_NAME=<bucket_name>
   S3_ENDPOINT=http://localstack:4566
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY=test
   AWS_SECRET_ACCESS_KEY=test
   ```

## running the application
   clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```
   run the application with docker compose:
   ```bash
   docker compose up --build
   ```

## api endpoints
   an overview of the available API endpoints, documented with Swagger.
   
   <img width="1696" height="663" alt="Captura de tela 2025-07-28 220103" src="https://github.com/user-attachments/assets/222f4686-5b9a-4204-ba5b-521b1f8da259" />
