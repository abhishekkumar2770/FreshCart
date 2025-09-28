// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import { connectDB } from "./config/connectDB.js";
// dotenv.config();
// import userRoutes from "./routes/user.routes.js";
// import sellerRoutes from "./routes/seller.routes.js";
// import productRoutes from "./routes/product.routes.js";
// import cartRoutes from "./routes/cart.routes.js";
// import addressRoutes from "./routes/address.routes.js";
// import orderRoutes from "./routes/order.routes.js";

// import { connectCloudinary } from "./config/cloudinary.js";

// const app = express();

// await connectCloudinary();
// // allow multiple origins
// const allowedOrigins = ["http://localhost:5173"];
// //middlewares
// app.use(cors({ origin: allowedOrigins, credentials: true }));
// app.use(cookieParser());
// app.use(express.json());

// app.get("/", (req, res) => res.send("Backend is running!"));

// // Api endpoints
// app.use("/images", express.static("uploads"));
// app.use("/api/user", userRoutes);
// app.use("/api/seller", sellerRoutes);
// app.use("/api/product", productRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/address", addressRoutes);
// app.use("/api/order", orderRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server is running on port ${PORT}`);
// });
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import { connectCloudinary } from "./config/cloudinary.js";

import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();

// --------------------
// Initialize services
// --------------------
let servicesInitialized = false;
async function initServices() {
  if (!servicesInitialized) {
    await connectCloudinary();
    await connectDB();
    servicesInitialized = true;
    console.log("✅ Services initialized (MongoDB + Cloudinary)");
  }
}

// Middleware to ensure services are initialized before any request
app.use(async (req, res, next) => {
  try {
    await initServices();
    next();
  } catch (err) {
    console.error("❌ Service initialization failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --------------------
// Middlewares
// --------------------
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL || ""];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// --------------------
// Routes
// --------------------
app.get("/", (req, res) => res.send("✅ Backend is running!"));
app.use("/images", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

// --------------------
// Export app for Vercel
// --------------------
export default app;

// --------------------
// Local dev: start server
// --------------------
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
