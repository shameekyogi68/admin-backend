// routes/vendorRoutes.js
import express from "express";
import {
  getAllVendors,
  getVendorById,
  blockVendor,
  deleteVendor,
} from "../controllers/vendorController.js";

const router = express.Router();

// GET all vendors
router.get("/getall", getAllVendors);

// GET single vendor
router.get("/get/:id", getVendorById);

// BLOCK / UNBLOCK vendor
// send { "block": true } or { "block": false } in body
router.patch("/:id/block", blockVendor);

// DELETE vendor
router.delete("/:id", deleteVendor);

export default router;
