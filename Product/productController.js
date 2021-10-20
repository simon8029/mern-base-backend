import express from "express";
import mongoose from "mongoose";

import Product from "./productModel.js";

const router = express.Router();

export const getProducts = async (req, res) => {
	const { offset, limit = 10 } = req.query;

	try {
		const startIndex = Number(offset) * limit;

		const total = await Product.countDocuments({});
		const products = await Product.find().sort({ _id: -1 }).limit(limit).skip(startIndex);

		res.json({
			data: products,
			currentPage: Number(offset),
			numberOfPages: Math.ceil(total / limit),
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getProductsByFilter = async (req, res) => {
	const { filter, tags } = req.query;

	try {
		const name = new RegExp(filter, "i");

		const products = await Product.find({
			$or: [{ name }, { tags: { $in: tags.split(",") } }],
		});

		res.json({ data: products });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getProduct = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await Product.findById(id);

		res.status(200).json(post);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createProduct = async (req, res) => {
	const post = req.body;

	const newProduct = new Product({
		...post,
		creator: req.userId,
		createdAt: new Date().toISOString(),
	});

	try {
		await newProduct.save();

		res.status(201).json(newProduct);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const updateProduct = async (req, res) => {
	const { id } = req.params;
	const { name, description, tags } = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

	const updatedProduct = {
		name,
		description,
		tags,

		_id: id,
	};

	await Product.findByIdAndUpdate(id, updatedProduct, { new: true });

	res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

	await Product.findByIdAndRemove(id);

	res.json({ message: "Product deleted successfully." });
};

export const likeProduct = async (req, res) => {
	const { id } = req.params;

	if (!req.userId) {
		return res.status(401).json({ message: "Unauthenticated" });
	}

	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

	const post = await Product.findById(id);

	const index = post.likes.findIndex((id) => id === String(req.userId));

	if (index === -1) {
		post.likes.push(req.userId);
	} else {
		post.likes = post.likes.filter((id) => id !== String(req.userId));
	}

	const updatedProduct = await Product.findByIdAndUpdate(id, post, {
		new: true,
	});

	res.status(200).json(updatedProduct);
};

export const commentProduct = async (req, res) => {
	const { id } = req.params;
	const { value } = req.body;

	const post = await Product.findById(id);

	post.comments.push(value);

	const updatedProduct = await Product.findByIdAndUpdate(id, post, {
		new: true,
	});

	res.json(updatedProduct);
};

export default router;
