import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import layoutsRouter from "./routes/layouts";
import appsRouter from "./routes/apps";
import codegenRouter from "./routes/codegen";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Backend API is running!",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      hello: "/api/hello",
      users: "/api/users",
      apps: "/api/apps",
      layouts: "/api/layouts",
      codegen: "/api/codegen/generate",
    },
  });
});

// Mount routes
app.use("/api/apps", appsRouter);
app.use("/api/layouts", layoutsRouter);
app.use("/api/codegen", codegenRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({
    message: "Hello from the backend! 🚀",
    timestamp: new Date().toISOString(),
  });
});

// Sample users endpoint
app.get("/api/users", (req: Request, res: Response) => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];
  res.json({ users });
});

app.post("/api/users", (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ 
      error: "Name and email are required" 
    });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
  };

  res.status(201).json({ 
    message: "User created successfully", 
    user: newUser 
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

