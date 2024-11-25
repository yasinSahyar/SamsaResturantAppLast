const express = require("express");
const router = express.Router();

const db = require("../data/db");


// Fetch products by menu ID
router.use("/products/menu/:menuid", async function(req, res) {
    const id = req.params.menuid;
    try {
        const [products, ] = await db.execute("select * from product where menuid=?", [id]);

        const [menus, ] = await db.execute("select * from menu");
       
        res.render("users/products",{
            title: "All Menus",
            products: products,
            menus: menus,
            selectedMenu: id
        })
    }
    catch (err){
        console.log(err);
    }
});

// Fetch product details by product ID
router.use("/products/:productid", async function (req, res) {
    const id = req.params.productid;
    try {
        const [products, ] = await db.execute("select * from product where productid=?", [id]);

        const product = products[0];

        if(product){
            return res.render("users/product-details" , {
                title: product.productname,
                product: product
            });
        }
        res.redirect("/"); //aradigi urun yoksa der anasayfaya don

    }
    catch (err){
        console.log(err);
    }
});


// Fetch all products
router.use("/products", async function (req, res) {

    try {
        const [products, ] = await db.execute("select * from product where approval=1");
        const [menus, ] = await db.execute("select * from menu");
       
        res.render("users/products",{
            title: "All Menus",
            products: products,
            menus: menus, 
            selectedMenu: null,
        })
    } 
    catch (err) {
        console.log(err);
    }

});


// Home route - renders the home page
router.get("/", async (req, res) => {
    try {
        const [products] = await db.execute("SELECT * FROM product WHERE approval=1 AND homepage=1");
        const [menus] = await db.execute("SELECT * FROM menu");

        res.render("users/index", {
            title: "Popular Menus",
            products,
            menus,
            selectedMenu: null,
        });
    } catch (err) {
        console.error(err);
    }
});


module.exports = router