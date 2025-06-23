import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import readmeRoutes from "./routes/readme";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Increase server timeout for long-running operations
app.use((req, res, next) => {
  // Set timeout to 5 minutes (300000ms)
  req.setTimeout(300000);
  res.setTimeout(300000);
  next();
});

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
      "http://127.0.0.1:3003",
      "https://readme-generator-phi.vercel.app",
      "https://*.vercel.app", // Allow all Vercel preview deployments
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api", readmeRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend server is running" });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Increase server timeout
server.timeout = 300000; // 5 minutes
