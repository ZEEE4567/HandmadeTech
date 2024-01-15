import { Request, Response } from 'express';
import * as cartService from '../services/shoppingCartService';
import * as userService from "../services/userService";

export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        let token = req.cookies.token?.token;

        let userId = await userService.verifyToken(token);

        const { productId, quantity } = req.body;

        const cart = await cartService.addToCart(userId, productId, quantity);
        res.json(cart);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}


export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        let token = req.cookies.token?.token;

        let userId = await userService.verifyToken(token);

        const {productId } = req.body;

        const cart = await cartService.removeFromCart(userId, productId);
        res.json(cart);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}

export const purchase = async (req: Request, res: Response): Promise<void> => {
    try {
        let token = req.cookies.token?.token;

        // Verify the token and get the user's ID
        let userId = await userService.verifyToken(token);

        // Ensure the userId is being set in the orders
        const user = await cartService.purchase(userId ); // Call the purchase function
        res.json(user);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err)
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}


export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
            let token = req.cookies.token?.token;
            let userId = await userService.verifyToken(token);

        const cart = await cartService.getCart(userId);
        res.json(cart);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}

export const updateCart = async (req: Request, res: Response): Promise<void> => {
    try {
        let token = req.cookies.token?.token;

        // Verify the token and get the user's ID
        let userId = await userService.verifyToken(token);

        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            throw new Error('Product ID and quantity are required');
        }

        const cart = await cartService.updateCart(userId, productId, quantity);
        res.json(cart);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    }
}
