import express from "express";
import {
  getAllData,
  getFilters,
  getStats,
} from "../controllers/data.controller.js";

const router = express.Router();

router.get("/", getAllData);
router.get("/filters", getFilters);
router.get("/stats", getStats);

export default router;