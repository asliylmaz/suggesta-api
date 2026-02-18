const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const tmdbRoutes = require("./routes/tmdb");

/* GLOBAL MIDDLEWARE */
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

/* ROUTES */
app.use("/api/users", require("./routes/users"));
app.use("/api/tmdb", tmdbRoutes);

/* EXPORT */
module.exports = app;
