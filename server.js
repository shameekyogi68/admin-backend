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

// Enhanced CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:3000",
];

// Add FRONTEND_URL from environment if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
  // Also add variations with different Vite ports
  const frontendHost = process.env.FRONTEND_URL.replace(':5173', '');
  allowedOrigins.push(`${frontendHost}:5174`);
  allowedOrigins.push(`${frontendHost}:5175`);
  allowedOrigins.push(`${frontendHost}:5176`);
}

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API Running...", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/admin", adminRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

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
