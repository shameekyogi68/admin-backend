// controllers/adminController.js
import Admin from "../models/AdminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// -------------------------
// Register Admin (Super Only)
// -------------------------
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await Admin.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      role: role === "super-admin" ? "super-admin" : "admin",
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------
// Login Admin
// -------------------------
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.status !== "active") {
      return res.status(403).json({ message: "Account is disabled" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------
// Get All Admins (Super)
// -------------------------
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------
// Create Admin (Super)
// -------------------------
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await Admin.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      role: role === "super-admin" ? "super-admin" : "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------
// Update Admin (Super)
// -------------------------
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, status } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (name) admin.name = name;
    if (role) admin.role = role === "super-admin" ? "super-admin" : "admin";
    if (status) admin.status = status;

    await admin.save();

    res.json({
      message: "Admin updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------
// Delete Admin (Super)
// -------------------------
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await admin.deleteOne();

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
