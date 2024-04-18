const express = require("express");
const productsData = require("../mockdata/products.json");

const router = express.Router();

//Get All roles
router.get("/getproducts", async (req, res) => {
  try {
    const products = productsData.Inventory;
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;