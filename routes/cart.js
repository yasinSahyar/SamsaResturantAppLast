//cart.js

const express = require("express");
const router = express.Router();
const { getCart, clearCart } = require("../shared/cart");

const db = require("../data/db");

let cart = []; // Temporary cart storage

// Cart Page
router.get("/", (req, res) => {
    const cartItems = req.session.cart || []; // Assuming you're storing cart in session
  res.render('cart', { cartItems });
});

// Checkout Page
router.get("/checkout", (req, res) => {
    const cart = getCart(); // Retrieve shared cart
    res.render("cart/checkout", { title: "Checkout", cart });
});

// Payment Success Page
router.get("/payment", (req, res) => {
    const { name } = req.body;
    clearCart(); // Clear the cart after payment
    res.render("cart/payment-success", { title: "Payment Successful" });
});

// Add item to cart
router.post("/add", (req, res) => {
    const { productId } = req.body;
    if (!productId) return res.status(400).send("Product ID is required");

    db.execute("SELECT * FROM product WHERE productid = ?", [productId])
        .then(([products]) => {
            const product = products[0];
            if (!product) return res.status(404).send("Product not found");
            // Add product to cart
            cart.push(product);
            res.redirect("/cart");
        })
        .catch(err => {
            console.error("Error fetching product:", err);
            res.status(500).send("Internal server error");
        });
});

module.exports = router;
