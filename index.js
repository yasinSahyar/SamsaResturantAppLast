const express = require("express");
const app = express();

const path = require("path");

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth"); // Import authentication routes


app.set("view engine", "ejs");
app.get("view engine");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json


// Serve static files
app.use("/libs",express.static("node_modules"));
app.use("/static", express.static("public"));

// Register routes
app.use(authRoutes); // Register authentication routes
app.use(userRoutes);
app.use("/admin",adminRoutes);

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send("Page not found");
});


app.listen(3000, function() {
    console.log("listening on port 3000");
}) ;