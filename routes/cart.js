//cart.js

const express = require('express');
const router = express.Router();

// Middleware to check if the cart exists in session
function checkCart(req, res, next) {
    if (!req.session.cart) {
        req.session.cart = []; // Initialize the cart if it doesn't exist
    }
    next();
}

// Route to view the cart
router.get('/', checkCart, (req, res) => {
    res.render('cart/cart', { 
        items: req.session.cart, 
        title: 'Shopping Cart' 
    });
});

// Route to add an item to the cart
router.post('/add', checkCart, (req, res) => {
    const { name, price, quantity } = req.body;

    if (name && price && quantity) {
        const existingItem = req.session.cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            req.session.cart.push({ name, price: parseFloat(price), quantity: parseInt(quantity) });
        }
    }

    res.redirect('/cart');
});
// Route to remove an item from the cart
router.post('/remove', checkCart, (req, res) => {
    const { name } = req.body;

    req.session.cart = req.session.cart.filter(item => item.name !== name);

    res.redirect('/cart');
});

// Route to clear the entire cart
router.post('/clear', checkCart, (req, res) => {
    req.session.cart = [];
    res.redirect('/cart');
});

router.post('/payment', (req, res) => {
    const { name, surname, address, card } = req.body;

    // Validate input data
    if (!name || !surname || !address || !card) {
        return res.status(400).send('All fields are required.');
    }

    const items = req.session.cart || [];
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    res.render('cart/payment-confirmation', {
        name,
        surname,
        address,
        card,
        items,
        totalPrice,
        title: 'Payment Confirmation'
    });
});


module.exports = router;
