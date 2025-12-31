// app.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");

const apiRouter = require("./apiRouter");
const User = require("./models/user.model");

const app = express();


/* ======================
   Middleware
====================== */

app.use(express.json());
app.use(express.static("public")); // OK for static assets

/* ======================
   MongoDB (cached connection)
====================== */

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB Connected");

    // Seed admin ONCE
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
        const existing = await User.findOne({email: adminEmail});
        if(!existing) {
            await User.create({
                email: adminEmail,
                password: adminPassword,
                role: "admin",
            });
            console.log(`Seeded admin user: ${adminEmail}`);
        }
    }
}

// connect on every cold start
connectDB();


/* ======================
   Routes
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

module.exports = app;
