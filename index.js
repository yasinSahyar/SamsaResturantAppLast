//index.js
const express = require("express");
const session = require("express-session");
const app = express();

const path = require("path");

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth"); // Import authentication routes
const cartRoutes = require("./routes/cart"); //add to cart


app.set("view engine", "ejs");
app.get("view engine");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json

// Session middleware setup
app.use(
    session({
        secret: "e1d5c9cb89eeb3b5807f44a1b91758e0c6e8437284d192244b5b56f1faba7d92", // Replace with a secure key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set to true if using HTTPS
    })
);


// Serve static files
app.use("/libs",express.static("node_modules"));
app.use("/static", express.static("public"));

// Register routes
app.use(authRoutes); // Register authentication routes
app.use(userRoutes);
app.use("/cart", cartRoutes); // Add "/cart" prefix to cart routes
app.use("/admin", adminRoutes);

// Home Route (Optional)
app.get('/', (req, res) => {
    res.redirect('/cart');
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send("Page not found");
});


app.listen(3000, function() {
    console.log("listening on port 3000");
}) ;