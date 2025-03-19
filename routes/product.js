const express = require("express");
const productController =  require("../controllers/product");

const productRouter = express.Router();

productRouter.get("/", productController.getProducts);
productRouter.post("/", productController.createProduct);
productRouter.put("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);

module.exports = productRouter;
