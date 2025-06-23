import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import readmeRoutes from "./routes/readme";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", readmeRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
