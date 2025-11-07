const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aman74086@",
  database: "student_result_db"
});


db.connect(err => {
  if (err) {
    console.error(" MySQL connection failed:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

// API: Get result by roll number
app.get("/result/:roll", (req, res) => {
  const roll = req.params.roll;
  const query = `
    SELECT s.name, s.class, r.subject, r.marks 
    FROM students s 
    JOIN results r ON s.id = r.student_id 
    WHERE s.roll_no = ?;
  `;
  db.query(query, [roll], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));



// Admin Login
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

// Add Student
app.post("/students", (req, res) => {
  const { roll_no, name, class_name } = req.body;
  const sql = "INSERT INTO students (roll_no, name, class) VALUES (?, ?, ?)";
  db.query(sql, [roll_no, name, class_name], (err) => {
    if (err) return res.status(500).json({ message: "Error adding student" });
    res.json({ message: "Student added successfully" });
  });
});

// Add Result
app.post("/results", (req, res) => {
  const { student_id, subject, marks } = req.body;
  const sql = "INSERT INTO results (student_id, subject, marks) VALUES (?, ?, ?)";
  db.query(sql, [student_id, subject, marks], (err) => {
    if (err) return res.status(500).json({ message: "Error adding result" });
    res.json({ message: "Result added successfully" });
  });
});
