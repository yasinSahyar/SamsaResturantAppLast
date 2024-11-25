const express = require("express");
const router = express.Router();
const db = require("../data/db"); // Assuming `db.js` is your database connection
const bcrypt = require("bcrypt");

// Render Login page
router.get("/login", (req, res) => {
    res.render("auth/login", {
        title: "Login",
    });
});

// Render Register page
router.get("/register", (req, res) => {
    res.render("auth/register", {
        title: "Register",
    });
});

// Handle Register form submission
router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if username or email already exists
        const [existingUsers] = await db.execute(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, email]
        );
        if (existingUsers.length > 0) {
            return res.send("Username or email already exists.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await db.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );

        //res.send("You have successfully registered.");
        res.redirect("/?message=successfully-registered");
        
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("An error occurred. Please try again later.");
    }
});

// Handle Login form submission
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [
            username,
        ]);

        if (users.length === 0) {
            return res.send("Invalid username or password.");
        }

        const user = users[0];

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send("Invalid username or password.");
        }

        // res.send("Login successful!");
        res.redirect("/?message=successfully-registered");

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred. Please try again later.");
    }
});

module.exports = router;
