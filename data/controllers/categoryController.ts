import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';
export const createCategory = async (req:Request, res:Response) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.json(category);
        console.log('Create category', category);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            res.status(500).json({message: 'An error occurred'});
        }
    }
}

export const findAllCategories = async (req:Request, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const filter = req.query.filter as string || '';

        const startIndex = (page - 1) * limit;

        const categories = await categoryService.findAllCategories(startIndex, limit, filter);
        res.json(categories);
        console.log('Get all categories');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            res.status(500).json({message: 'An error occurred'});
        }
    }
}

export const findCategoryById = async (req:Request, res:Response) => {
    try {
        const category = await categoryService.findCategoryById(req.params.id);

        if (category == null) {
            return res.status(404).json({message: 'Category not found'});
        }

        res.json(category);
        console.log('Get category by id');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            res.status(500).json({message: 'An error occurred'});
        }
    }
}

export const updateCategory = async (req:Request, res:Response) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        res.json(category);
        console.log('Update category', category);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            res.status(500).json({message: 'An error occurred'});
        }
    }
}

export const deleteCategoryById = async (req:Request, res:Response) => {
    try {
        const category = await categoryService.deleteCategoryById(req.params.id);
        res.json(category);
        console.log('Delete category', category);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            res.status(500).json({message: 'An error occurred'});
        }
    }
}

export const findCategoryByName = async (req:Request, res:Response) => {
    try {
        const category = await categoryService.findCategoryByName(req.params.name);
        if (category == null) {
            return res.status(404).json({message: 'Category not found'});
        }
        res.json(category);
        console.log('Get category by name');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            // handle non-Error objects or throw an exception
            res.status(500).json({message: 'An error occurred'});
        }
    }
}

