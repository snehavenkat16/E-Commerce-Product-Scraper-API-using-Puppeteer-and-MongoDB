const Product = require("../models/product");

const productController = {

    getProducts: async (req, res) => {
        try {
            const filters = {};
            if (req.query.minPrice) filters.price = { $gte: req.query.minPrice };
            if (req.query.maxPrice) filters.price = { $lte: req.query.maxPrice };
            if (req.query.rating) filters.rating = req.query.rating;
            const products = await Product.find(filters).sort({ updatedAt: -1 });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createProduct: async (req, res) => {
        try {
            let productDetails = req.body;
            const product = new Product(productDetails);
            await product.save();
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateProduct: async (req, res) => {
        try {

            if (!req.body || !req.params.id) return res.status(400).json({ message: "Please provide all details" });

            const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    deleteProduct: async (req, res) => {
        try {
            if (!req.params.id) return res.status(400).json({ message: "Error while deleting the product" });
            let result = await Product.findByIdAndDelete(req.params.id);
            res.status(200).json('Product Deleted Successfully')
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}


module.exports = productController;
