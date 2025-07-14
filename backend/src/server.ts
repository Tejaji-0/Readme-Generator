import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import readmeRoutes from "./routes/readme";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Increase server timeout for long-running operations
app.use((req, res, next) => {
  // Set timeout to 15 minutes (900000ms) for large repositories
  req.setTimeout(900000);
  res.setTimeout(900000);
  next();
});

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "https://readme-generator-phi.vercel.app",
      ];

      // Allow all Vercel preview deployments
      if (origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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

// Increase server timeout to 15 minutes for large repositories
server.timeout = 900000; // 15 minutes
