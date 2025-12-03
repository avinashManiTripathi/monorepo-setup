# Backend API

Express.js API server with TypeScript support.

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Server will start at [http://localhost:4000](http://localhost:4000)

## Features

- Express.js web framework
- TypeScript support
- CORS enabled
- Hot reload with tsx
- RESTful API design

## Project Structure

```
backend/
├── src/
│   └── index.ts          # Main server file
├── dist/                 # Compiled JavaScript (after build)
├── tsconfig.json        # TypeScript configuration
├── .env.example         # Environment variables template
└── package.json         # Package dependencies
```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm clean` - Clean build artifacts

## API Endpoints

### Health & Info

- `GET /` - API information and available endpoints
- `GET /health` - Health check with uptime information

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

### Sample

- `GET /api/hello` - Hello world endpoint with timestamp

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=4000
NODE_ENV=development
```

## Adding New Routes

1. Open `src/index.ts`
2. Add new route handlers:

```typescript
app.get("/api/your-route", (req, res) => {
  res.json({ message: "Your response" });
});
```

## Error Handling

The API includes:
- 404 handler for unknown endpoints
- Global error handler for server errors
- Validation for required fields

## CORS Configuration

CORS is enabled for all origins in development. Update `src/index.ts` for production:

```typescript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## Learn More

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

