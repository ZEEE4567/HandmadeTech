import {Product} from '../models/products';
import {Category} from "../models/categories";
import {Order} from "../models/orders";



export const createProduct = async (body: any) => {
    try {
        const product = new Product({
            name: body.name,
            imageUrl: body.imageUrl,
            description: body.description,
            price: body.price,
            category: body.category,
        });
        await product.save();
        return product.populate('category');
    }
    catch (err) {
        throw err;
    }
}

//TODO: Implement pagination, sorting, searching and image/document upload functions


export const findProductsByCategory = async (categoryName: string) => {
    try {
        const category = await Category.findOne({ name: categoryName });

        if (!category) {
            throw new Error('Category not found');
        }

        const products = await Product.find({ category: category._id }).populate('category');
        return products;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}



export const deleteProductById = async (productId: string) => {
    try {
        const product = await Product.findByIdAndDelete(productId);
        return product;
    }
    catch (err) {
        throw err;
    }
}

export const findAllProducts = async () => {
    try {
        const products = await Product.find().populate('category');
        return products;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}
export const findProductById = async (productId: string) => {
    try {
        const product = await Product.findById(productId).populate('category');
        return product;
    }
    catch (err) {
        throw err;
    }
}


export const update = async (productId: string, body: any) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error("Product not found");
        }
        product.name = body.name;
        product.imageUrl = body.imageUrl;
        product.description = body.description;
        product.price = body.price;
        product.category = body.category;
        await product.save();

        return {message: "Product updated", product};
    }
    catch (error) {
        console.error(error);
        throw new Error("Internal Server Error");
    }
}

export const findAllOrders = async () => {
    try {
        const orders = await Order.find();
        return orders;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}