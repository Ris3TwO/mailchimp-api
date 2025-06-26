# Mailchimp Integration API with NestJS

A type-safe, extensible API built with NestJS to manage Mailchimp subscribers.

## ✨ Features

- ✅ Full integration with Mailchimp API v3
- 🔐 Data validation using `class-validator`
- 💡 Type-safe endpoints with DTOs
- 🛠️ Custom error handling system
- 🧪 Unit and E2E testing with Jest
- 🧾 Auto-generated API docs via Swagger
- 🚦 Built-in rate limiting
- 🔧 Environment configuration with `@nestjs/config`

## 📦 Instalación

```bash
# Clone the repository
git clone https://github.com/Ris3TwO/mailchimp-api.git
cd mailchimp-api

# Install dependencies
npm install
```

### 🔐 Environment Variables

Copy the example file and edit it:

```bash
cp .env.example .env
```

Then edit `.env` with your credentials:

```ini
MAILCHIMP_API_KEY=your-api-key-usX
MAILCHIMP_SERVER_PREFIX=usX
MAILCHIMP_AUDIENCE_ID=your-audience-id
```

## 🚀 Running the App

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 📨 Available Endpoints

| Método  | Endpoint                  | Descripción                     |
| ------- |:-------------------------:|:-------------------------------:|
| POST    | /v1/mailchimp/subscribe   | Add a new subscriber            |
| GET     | /v1/mailchimp             | Health check of the service     |

### Example POST Request

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "tags": ["newsletter"],
  "language": "es"
}
```

## 🧪 Running Tests

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e
```

## 🧰 Tech Stack

* [NestJS](https://nestjs.com/) - TypeScript backend framework
* [Mailchimp API v3](https://mailchimp.com/developer/) - Email marketing platform
* [class-validator](https://github.com/typestack/class-validator) - Validation library
* [Jest](https://jestjs.io/) - Testing framework
* [Swagger](https://swagger.io/) - API documentation

## 📚 API Documentation

Once the server is running, open:
`http://localhost:3000/api` To explore the API using Swagger UI.

## 🗂 Project Structure

```text
src/
├── mailchimp/
│   ├── dto/               # Data Transfer Objects
│   ├── interfaces/        # TypeScript interfaces
│   ├── filters/           # Custom exception filters
│   ├── mailchimp.controller.ts
│   ├── mailchimp.service.ts
│   └── mailchimp.module.ts
├── app.config.ts          # App-wide configuration
├── app.module.ts          # Main application module
└── main.ts                # Entry point
```