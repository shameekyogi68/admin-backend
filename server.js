import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import Admin from "./models/AdminModel.js";
import planRoutes from "./routes/planRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

dotenv.config();
connectDB(); // Only one DB connection

const app = express();

// CORS Configuration for Netlify Frontend
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Allow all Netlify domains (production + previews)
    if (origin.includes('convenzadmin.netlify.app') || 
        origin === 'http://localhost:5173' ||
        origin === 'http://localhost:5174' ||
        origin === 'http://localhost:5175' ||
        origin === 'http://localhost:5176' ||
        origin === 'http://localhost:3000') {
      return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API Running...", timestamp: new Date().toISOString() });
});

// Debug route
app.get("/api/test", (req, res) => {
  res.json({ 
    status: "OK",
    message: "Backend is responding",
    endpoints: {
      login: "POST /api/admin/login",
      dashboard: "GET /api/admin/dashboard"
    }
  });
});

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminDashboardRoutes); // Dashboard uses /api/admin/dashboard
app.use("/api/vendors", vendorRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// 404 handler - must be AFTER all routes
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: "Route not found",
    method: req.method,
    url: req.url,
    message: "The requested endpoint does not exist"
  });
});

const PORT = process.env.PORT || 3001;

// Ensure Default Super Admin
async function ensureDefaultAdmin() {
  try {
    const existing = await Admin.findOne({ role: "super-admin" });
    if (!existing) {
      await Admin.create({
        name: "Super Admin",
        email: "admin@gmail.com",
        password: "admin123",
        role: "super-admin",
      });
      console.log("✅ Default super admin created: admin@gmail.com / admin123");
    }
  } catch (e) {
    console.error("Failed to ensure default admin", e);
  }
}

ensureDefaultAdmin();

app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
