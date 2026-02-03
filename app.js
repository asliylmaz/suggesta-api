const express = require("express");
const mongoose = require("mongoose");

const app = express();

/* GLOBAL MIDDLEWARE */
app.use(express.json());

/* ROUTES */
app.use("/api/users", require("./routes/users"));

/* EXPORT */
module.exports = app;
