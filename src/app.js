"use strict";

const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const app = express();
const http = require("http");

const PORT = process.env.PORT || 80;

dotenv.config({
  path: "./src/.env",
});

const database = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});

database.connect((err) => {
  err ? console.log(err) : console.log("MySQL Connection Success");
});

app.use(express.urlencoded({ extended: false }));

const location = path.join(__dirname, "../public");

app.use(express.static(location));
app.set("view engine", "hbs");

app.use("/", require("../routes/pages"));
app.use("/auth", require("../routes/auth"));

app.listen(PORT, () => {
  console.log(`Server has been started @ Port ${PORT}`);
});
