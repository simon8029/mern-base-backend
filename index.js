import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import productRoutes from "./Product/productRoutes.js";

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/products", productRoutes);

const CONNECTION_URL = "mongodb://localhost:27017/my_db";
const PORT = process.env.PORT || 8139;

mongoose
	.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => app.listen(PORT, () => console.log(`Server is running on Port: http://localhost:${PORT}`)))
	.catch((error) => console.log(`${error} did not connect`));
