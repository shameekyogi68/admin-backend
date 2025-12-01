// routes/adminDashboardRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/adminDashboardController.js";

const router = express.Router();

router.get("/dashboard", getDashboardStats);
export default router;
