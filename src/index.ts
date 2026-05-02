import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files (This is where your staff images and template thumbnails will live)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.send("GISCON CV Tool API is Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
