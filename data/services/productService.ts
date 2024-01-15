import {Product} from '../models/products';
import {Category} from "../models/categories";
import {Order} from "../models/orders";



export const createProduct = async (body: any) => {
    try {
        console.log(body); // Log the entire body

        if (!body.productData) {
            throw new Error('Product data not found in request body');
        }

        const imageUrl = body.file ? body.file.path : './uploads/';
        const productData = JSON.parse(body.productData);

        const product = new Product({
            name: productData.name,
            imageUrl: imageUrl,
            description: productData.description,
            price: productData.price,
            category: productData.category,
        });

        await product.save();
        return product.populate('category');
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}




export const findProductsByCategory = async (categoryName: string, offset = 0, limit = 10, sort: string = 'name_asc', filter: string = '') => {
    try {
        const category = await Category.findOne({ name: categoryName });

        if (!category) {
            throw new Error('Category not found');
        }

        // Parse the sort parameter
        const [sortField, sortOrder] = sort.split('_');
        const sortObject = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

        // Parse the filter parameter
        const filterObject = filter ? { name: { $regex: filter, $options: 'i' } } : {};

        const products = await Product.find({ category: category._id, ...filterObject }).skip(offset).limit(limit).sort(sortObject as { [key: string]: any }).populate('category');
        const totalProducts = await Product.countDocuments({ category: category._id, ...filterObject });
        const page = Math.floor(offset / limit) + 1;
        const hasMore = offset + limit < totalProducts;

        return {
            data: products,
            pagination: {
                pageSize: limit,
                page: page,
                hasMore: hasMore,
                total: totalProducts,
            },
        };
    } catch (err) {
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

export const findAllProducts = async (offset = 0, limit = 10, sort: string = 'name_asc', filter: string = '', minPrice: number = 0, maxPrice: number = Infinity) => {
    try {
        const [sortField, sortOrder] = sort.split('_');
        const sortObject = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

        let filterObject: any = {
            price: { $gte: minPrice, $lte: maxPrice }
        };

        if (filter) {
            filterObject.name = { $regex: filter, $options: 'i' };
        }

        const products = await Product.find(filterObject).skip(offset).limit(limit).sort(sortObject as { [key: string]: any }).populate('category');

        const totalProducts = await Product.countDocuments(filterObject);

        const page = Math.floor(offset / limit) + 1;

        const hasMore = offset + limit < totalProducts;

        return {
            data: products,
            pagination: {
                pageSize: limit,
                page: page,
                hasMore: hasMore,
                total: totalProducts,
            },
        };
    } catch (err) {
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
        product.imageUrl = body.file.path;
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

export const findAllOrders = async (offset = 0, limit = 10, sort: string = 'date_asc', filter: string = '') => {
    try {
        const [sortField, sortOrder] = sort.split('_');
        const sortObject = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

        const filterObject = filter ? { 'products.name': { $regex: filter, $options: 'i' } } : {};

        const orders = await Order.find(filterObject).skip(offset).limit(limit).sort(sortObject as { [key: string]: any }).populate('products');

        const totalOrders = await Order.countDocuments(filterObject);

        const page = Math.floor(offset / limit) + 1;

        const hasMore = offset + limit < totalOrders;

        return {
            data: orders,
            pagination: {
                pageSize: limit,
                page: page,
                hasMore: hasMore,
                total: totalOrders,
            },
        };
    } catch (err) {
        console.error(err);
        throw err;
    }
}