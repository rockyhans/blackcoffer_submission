import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import dataRoutes from "./src/routes/data.routes.js";

dotenv.config();

connectDB();

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/data", dataRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});