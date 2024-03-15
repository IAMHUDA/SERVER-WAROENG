const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = "INSERT INTO login (email, password) VALUES (?, ?)";
        db.query(sql, [email, password], (err, result) => {
            if (err) {
                console.error('Error inserting data: ' + err.stack);
                return res.json({ success: false, message: "Failed to register user." });
            }
            console.log('Data inserted successfully.');
            return res.json({ success: true, message: "User registered successfully." });
        });
    } catch (err) {
        console.error('Error inserting data: ' + err.stack);
        return res.json({ success: false, message: "Failed to register user." });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
        db.query(sql, [email, password], (err, result) => {
            if (err) {
                console.error('Error querying data: ' + err.stack);
                return res.json({ success: false, message: "Error" });
            }
            if (result.length > 0) {
                console.log('Login successful.');
                return res.json({ success: true, message: "Login successful.", user: result[0] });
            } else {
                console.log('Invalid email or password.');
                return res.json({ success: false, message: "Invalid email or password." });
            }
        });
    } catch (err) {
        console.error('Error querying data: ' + err.stack);
        return res.json({ success: false, message: "Error" });
    }
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
