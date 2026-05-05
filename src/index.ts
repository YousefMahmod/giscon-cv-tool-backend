import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import staffRoutes from "./routes/staffRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import participationRoutes from "./routes/participationRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

// Import middleware
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

// Import database connection to test it
import pool from "./db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// i want write it from root
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (for reverse proxy setups like Nginx)
app.set("trust proxy", true);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (This is where your staff images and template thumbnails will live)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "GISCON CV Tool API is Running 🚀",
    version: "1.0.0",
    endpoints: {
      staff: "/staff",
      projects: "/projects",
      participation: "/staff/participation",
      templates: "/templates",
      export: "/download-cv/:staffId",
    },
  });
});

// API Routes
app.use("/staff", staffRoutes);
app.use("/projects", projectRoutes);
app.use("/staff/participation", participationRoutes);
app.use("/templates", templateRoutes);
app.use("/", exportRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
  console.log(`📊 Database connected to ${process.env.DB_NAME}`);
});

server.on("error", (error: any) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error("❌ Server error:", error);
  }
  process.exit(1);
});
