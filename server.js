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
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:3000',
      'https://convenzadmin.netlify.app'
    ];
    
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow if in allowedOrigins list OR any Netlify preview domain
    if (allowedOrigins.includes(origin) || origin.includes('.netlify.app')) {
      return callback(null, true);
    }
    
    // Reject all other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API Running...", timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
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
