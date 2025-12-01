// routes/adminRoutes.js
import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";
import { adminAuth } from "../middleware/authMiddleware.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = express.Router();

// Public
router.post("/login", loginAdmin);

// Super Admin only: manage admins
router.post(
  "/register",
  adminAuth,
  roleCheck(["super-admin"]),
  registerAdmin
);

router.get(
  "/admins",
  adminAuth,
  roleCheck(["super-admin"]),
  getAdmins
);

router.post(
  "/admins",
  adminAuth,
  roleCheck(["super-admin"]),
  createAdmin
);

router.put(
  "/admins/:id",
  adminAuth,
  roleCheck(["super-admin"]),
  updateAdmin
);

router.delete(
  "/admins/:id",
  adminAuth,
  roleCheck(["super-admin"]),
  deleteAdmin
);

export default router;
