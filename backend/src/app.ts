import express from "express";
import cors from "cors";
import "dotenv/config";
import { api } from "./routes/api";

const app = express();
const port = process.env.PORT || 3000;

// Allow requests from frontend
app.use(cors());
app.use(express.json());

// Simple test route ********'
//app.get("/", (_req, res) => res.send("CloudCrafter backend is running!")); ******

// Register all /api routes
app.use("/api", api);

app.listen(process.env.PORT || 3000, () => console.log(`Backend running...`));
