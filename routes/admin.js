const express = require("express");
const router = express.Router();


router.use("/product/create", function (req, res) {
    res.render("admin/product-create");
});

router.use("/product/:productid", function (req, res) {
    res.render("admin/product-edit");
});

router.use("/products", function (req, res) {
    res.render("admin/product-list");
});




module.exports = router;