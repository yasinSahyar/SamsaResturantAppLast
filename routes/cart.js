//cart.js

const express = require("express");
const router = express.Router();
const db = require("../data/db");

// Middleware to check if the cart exists
function checkCart(req, res, next) {
    if (!req.session.cart) {
        req.session.cart = []; // Initialize the cart if it doesn't exist
    }
    next();
}

// Route to view the cart
router.get('/', checkCart, (req, res) => {
    // Pass a title to the view
    res.render('cart/cart', { 
        items: req.session.cart, 
        title: 'Shopping Cart' // Title for the cart page
    });
});

// Route to add an item to the cart
router.post('/add', checkCart, (req, res) => {
    const { name, quantity } = req.body;

    // Simple validation to check that name and quantity are provided
    if (name && quantity) {
        // Check if item already exists in the cart
        const existingItem = req.session.cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += parseInt(quantity); // Update quantity if the item is already in the cart
        } else {
            // Add new item to the cart
            req.session.cart.push({ name, quantity: parseInt(quantity) });
        }
    }

    // Redirect to the cart page to show the updated cart
    res.redirect('/cart');
});

// Route to remove an item from the cart
router.post('/remove', checkCart, (req, res) => {
    const { name } = req.body;

    // Remove the item from the cart by filtering it out
    req.session.cart = req.session.cart.filter(item => item.name !== name);

    // Redirect back to the cart page after removal
    res.redirect('/cart');
});

// Route to clear the entire cart
router.post('/clear', checkCart, (req, res) => {
    req.session.cart = []; // Clear the cart
    res.redirect('/cart'); // Redirect back to the cart page
});

module.exports = router;