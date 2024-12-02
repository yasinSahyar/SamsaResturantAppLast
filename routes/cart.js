//cart.js

const express = require('express');
const router = express.Router();
const path = require('path');

// Middleware to initialize cart in session
function checkCart(req, res, next) {
    if (!req.session.cart) {
        req.session.cart = []; // Initialize cart if undefined
        console.log("Initialized empty cart");
    }
    next();
}

// Apply checkCart middleware to all /cart routes
router.use(checkCart);

// GET /cart - Display the shopping cart
// routes/cart.js
router.get('/', (req, res) => {
    // Retrieve cart from session or set an empty array if undefined
    const cartItems = req.session.cart || [];

    res.render('cart/cart', {
        items: cartItems,
        totalPrice: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    });
});



// POST route to add item to cart
router.post('/add', (req, res) => {
    const { name, price, quantity, id } = req.body;

    // Validate mandatory fields
    if (!name || !price || !quantity) {
        return res.status(400).send({ message: 'Name, price, and quantity are required.' });
    }

    // Automatically generate a product ID if none is provided
    const productId = id || Date.now(); // Unique ID based on timestamp or provided ID

    const newItem = {
        id: productId,
        name,
        price,
        quantity
    };

    // Ensure session.cart is initialized
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Add item to cart
    req.session.cart.push(newItem);

    // Send response
    res.send({ message: 'Item added to cart', cart: req.session.cart });
});


// POST /cart/payment - Process payment and show confirmation
router.post('/payment', (req, res) => {
    const { name, address, card } = req.body;

    if (!name || !address || !card) {
        return res.status(400).send('All fields are required.');
    }

    const items = req.session.cart || [];
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Clear the cart after payment
    req.session.cart = [];

    res.render('cart/confirmation', {
        name,
        address,
        items,
        totalPrice,
        title: 'Payment Confirmation',
    });
});


module.exports = router;
