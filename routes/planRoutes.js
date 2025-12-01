import express from "express";
import { addPlan, getPlans, getPlanById, updatePlan, deletePlan } from "../controllers/planController.js";

const router = express.Router();

router.post("/add", addPlan);
router.get("/all", getPlans);
router.get("/:id", getPlanById);
router.put("/update/:id", updatePlan);
router.delete("/delete/:id", deletePlan);

export default router;
