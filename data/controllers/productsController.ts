import { Request, Response } from 'express';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';
import {Product} from "../models/products";


export const getProducts = async (req:Request, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sort = req.query.sort as string || 'name_asc';
        const filter = req.query.filter as string || '';
        const minPrice = parseInt(req.query.minPrice as string) || 0;
        const maxPrice = parseInt(req.query.maxPrice as string) || Infinity;

        const startIndex = (page - 1) * limit;

        const products = await productService.findAllProducts(startIndex, limit, sort, filter, minPrice, maxPrice);
        res.json(products);
        console.log('Get all products');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            // handle non-Error objects or throw an exception
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}


export const getProductById = async (req:Request, res:Response) => {
    try {
        const product = await productService.findProductById(req.params.id);
        res.json(product);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            // handle non-Error objects or throw an exception
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}

export const createProduct = async (req:Request, res:Response) => {
    try {
        const product = await productService.createProduct(req.body);
        res.json(product);
        console.log('Create product', product);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}

export const updateProduct = async (req:Request, res:Response) => {
    try {
        const product = await productService.update(req.params.id, req.body);
        res.json(product);
        console.log('Update product', product);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}

export const deleteProduct = async (req:Request, res:Response) => {
    try {
        const product = await productService.deleteProductById(req.params.id);
        res.json(product);
        console.log('Delete product', product);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}

export const getProductsByCategory = async (req:Request, res:Response) => {
    try {
        const category = req.params.category;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sort = req.query.sort as string || 'name_asc';
        const filter = req.query.filter as string || '';
        const offset = (page - 1) * limit;

        // Check if the category exists
        const categoryExists = await categoryService.findCategoryByName(category);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const result = await productService.findProductsByCategory(category, offset, limit, sort, filter);

        if (result.data.length === 0 ) {
            return res.status(404).json({ message: 'Products not found' });
        }
        console.log(category)
        res.json(result);
        console.log('Get all products by category');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            // handle non-Error objects or throw an exception
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}


export const getOrders = async (req:Request, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sort = req.query.sort as string || 'date_asc';
        const filter = req.query.filter as string || '';

        const startIndex = (page - 1) * limit;

        const orders = await productService.findAllOrders(startIndex, limit, sort, filter);
        res.json(orders);
        console.log('Get all orders');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            res.status(500).json({message: 'An error occurred'});
        }
    }
}

export const searchProducts = async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.searchTerm as string || '';
        const products = await Product.find({ name: { $regex: searchTerm, $options: 'i' } });
        res.json(products);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}


