const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Render avtomatik PORT beradi
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Frontend statik fayllar
app.use(express.static(path.join(__dirname, "frontend")));

// Test endpoint (Render uxlab qolmasligi uchun ham foydali)
app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Asosiy sahifa
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Server ishga tushdi
app.listen(PORT, () => {
  console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
});