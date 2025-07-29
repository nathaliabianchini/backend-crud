# Backend Project

This is a backend API built with Node.js, Express, TypeScript, and PostgreSQL. Prisma is used for database access, and the application runs in a Dockerized environment.

## Technologies Used

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Docker
- Docker Compose
- AWS S3 (via LocalStack)
- JWT for authentication

## Prerequisites

- Docker and Docker Compose installed
- DBeaver or any PostgreSQL database client (optional)

## Running the Application

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Create a `.env` file in the root of the project and add the following variables:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:bootcamp1@localhost:5432/bootcamp_db?schema=public"
   JWT_SECRET=your_jwt_secret_here
   BUCKET_NAME=bootcamp
   S3_ENDPOINT=http://localstack:4566
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY=test
   AWS_SECRET_ACCESS_KEY=test
   ```

3. Run the application with Docker Compose:
   ```bash
   docker compose up --build
   ```

4. The API will be available at `http://localhost:3000`.

## Testing the Endpoints

You can test the endpoints using Postman or another API client.

### Authentication Routes

- `POST /auth/register`
- `POST /auth/sign-in`

## Database Migrations

To apply Prisma migrations (optional when running manually):
```bash
npx prisma migrate dev --name your_migration_name
```

## License

This project is licensed for educational purposes.
