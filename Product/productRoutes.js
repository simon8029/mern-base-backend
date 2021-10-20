import express from "express";

import {
	getProducts,
	getProductsByFilter,
	getProduct,
	createProduct,
	updateProduct,
	likeProduct,
	commentProduct,
	deleteProduct,
} from "./productController.js";

const router = express.Router();
import auth from "../Middleware/auth.js";

router.get("/", getProducts);
router.get("/:id", getProduct);
router.get("/search", getProductsByFilter);

router.post("/", auth, createProduct);
router.post("/:id/commentProduct", commentProduct);
router.patch("/:id/likeProduct", auth, likeProduct);
router.patch("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

export default router;
