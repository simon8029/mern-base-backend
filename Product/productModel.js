import mongoose from "mongoose";

const productSchema = mongoose.Schema({
	name: String,
	description: String,
	tags: [String],
	likes: { type: [String], default: [] },
	comments: { type: [String], default: [] },
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

var Product = mongoose.model("Product", productSchema);

export default Product;
