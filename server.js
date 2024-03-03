const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

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

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO login (email, password) VALUES (?, ?)";
        db.query(sql, [email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting data: ' + err.stack);
                return res.json("Error");
            }
            console.log('Data inserted successfully.');
            return res.json(result);
        });
    } catch (err) {
        console.error('Error hashing password: ' + err.stack);
        return res.json("Error");
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = "SELECT * FROM login WHERE `email` = ?";
        db.query(sql, [email], async (err, result) => {
            if (err) {
                console.error('Error querying data: ' + err.stack);
                return res.json("Error");
            }
            if (result.length > 0) {
                const match = await bcrypt.compare(password, result[0].password);
                if (match) {
                    console.log('Login successful.');
                    return res.json(result);
                } else {
                    console.log('Invalid password.');
                    return res.json("Invalid password");
                }
            } else {
                console.log('User not found.');
                return res.json("User not found");
            }
        });
    } catch (err) {
        console.error('Error comparing password: ' + err.stack);
        return res.json("Error");
    }
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
