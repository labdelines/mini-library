require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/book.routes");
const authRoutes = require("./routes/auth.routes");
const User = require("./models/user.model");

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI || "your_fallback_uri_here")
  .then(async () => {
    console.log("MongoDB Connected");

    // Seed default admin if not exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      const existing = await User.findOne({ email: adminEmail });
      if (!existing) {
        await User.create({
          email: adminEmail,
          password: adminPassword,
          role: "admin",
        });
        console.log(`Seeded admin user: ${adminEmail}`);
      }
    } else {
      console.log("No ADMIN_EMAIL/ADMIN_PASSWORD in .env, skipping seeding");
    }
  })
  .catch((err) => console.log("MongoDB Error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
