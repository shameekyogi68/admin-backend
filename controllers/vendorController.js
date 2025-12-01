// controllers/vendorController.js
import Vendor from "../models/vendor.js";


// GET all vendors
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Vendor list fetched successfully",
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error("getAllVendors error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching vendors",
    });
  }
};

// GET single vendor by ID
export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.error("getVendorById error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching vendor",
    });
  }
};

// BLOCK / UNBLOCK vendor
export const blockVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { block } = req.body; // true = block, false = unblock

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.isBlocked = block === true;
    vendor.status = block === true ? "blocked" : "approved";
    vendor.notification = block
      ? "Your vendor account has been blocked by admin."
      : "Your vendor account has been unblocked by admin.";

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: block ? "Vendor blocked successfully" : "Vendor unblocked successfully",
      vendor,
    });
  } catch (error) {
    console.error("blockVendor error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update vendor block status",
    });
  }
};

// DELETE vendor
export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findByIdAndDelete(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    console.error("deleteVendor error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete vendor",
    });
  }
};
