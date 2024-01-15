import { Request, Response } from 'express';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';


export const getProducts = async (req:Request, res:Response) => {
    try {
        const products = await productService.findAllProducts();
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

        // Check if the category exists
        const categoryExists = await categoryService.findCategoryByName(category);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const products = await productService.findProductsByCategory(category);

        if (products.length === 0 ) {
            return res.status(404).json({ message: 'Products not found' });
        }
        console.log(category)
        res.json(products);
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
        const orders = await productService.findAllOrders();
        res.json(orders);
        console.log('Get all orders');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            // handle non-Error objects or throw an exception
            res.status(500).json({message: 'An error occurred'});
        }
    }
}
