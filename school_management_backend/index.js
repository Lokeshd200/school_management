const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const dotEnv = require("dotenv");

require('dotenv').config();
const app = express();
const PORT =process.env.port || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/schoolImages", express.static(path.join(__dirname, "schoolImages")));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "schoolImages/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Change this to your MySQL username
  password: process.env.password, // Change this to your MySQL password
  database: "school_management",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// API to Add School Data
app.post("/addSchool", upload.single("image"), (req, res) => {
  const { name, address, city, state, contact, email_id } = req.body;
  const image = req.file ? `/schoolImages/${req.file.filename}` : "";

  const query =
    "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [name, address, city, state, contact, image, email_id],
    (err, result) => {
      if (err) {
        console.error("Error adding school:", err);
        res.status(500).send("Error adding school.");
        return;
      }
      res.status(201).send("School added successfully.");
    }
  );
});

// API to Fetch School Data
app.get("/schools", (req, res) => {
  const query = "SELECT id, name, address, city, image FROM schools";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching schools:", err);
      res.status(500).send("Error fetching schools.");
      return;
    }
    res.status(200).json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
