import { Request, Response } from 'express';
import * as userService from '../services/userService';
import {decode} from "jsonwebtoken";
import {scopes} from "../scopes/userScopes";



export const register = async (req: Request, res: Response) => {
    try {
        let token: string= req.cookies.token;

        if (token) {
            res.status(401).send({auth: true, message: 'Logout before registering a new user'});
            return;
        }
        const user = await userService.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {

            res.status(500).json({message: 'An error occurred'});
        }
    }
};

export const verifyToken = async (req: Request, res: Response) => {
    try {
        let token: string= req.cookies.token;

        if (!token) {
            res.status(401).send({ auth: false, message: 'No token provided.' });
            return;
        }
        const decoded = await userService.verifyToken(token);
        res.status(200).json(decoded);
    } catch (err) {
        if (err && typeof err === 'object' && 'message' in err) {
            res.status(500).json({ message: err.message });
        } else {

            throw err;
        }
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        const user = await userService.findUserByUsername(username);

        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        const isMatch = await userService.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        console.log('User', user)
        const token = userService.createToken(user);


        res.cookie('token', token, {httpOnly: true});
        res.status(200).json({message: 'Login successful', role:user.role});
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {

            res.status(500).json({message: 'An error occurred'});
        }
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        let token = req.cookies.token?.token;

        let userId = await userService.verifyToken(token);

        const user = await userService.findUserById(userId);
        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }


        res.cookie('token', '', { httpOnly: true, maxAge: 0 });

        res.status(200).json({message: 'Logout successful', scope: user.scope});
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            res.status(500).json({message: 'An error occurred'});
        }
    }
};


export const getProfile = async (req: Request, res: Response) => {

    try {
        let token = req.cookies.token?.token;


        let userId = await userService.verifyToken(token);

        if (!userId) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        const user = await userService.findUserById(userId);
        res.json(user);
        console.log('Get me', user);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});

            res.status(500).json({message: 'An error occurred'});
        }
    }
};

        export const updateSelf = async (req: Request, res: Response) => {
            try {
                let token = req.cookies.token?.token;


                let userId = await userService.verifyToken(token);

                if (!userId) {
                    return res.status(401).json({message: 'Unauthorized'});
                }

                const user = await userService.update(userId, req.body);
                res.json(user);
                console.log('Update user', user);
            } catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({message: err.message});
                } else {
                    res.status(500).json({message: 'An error occurred'});
                }
            }
        }

        export const updateUserById = async (req: Request, res: Response) => {
            try {
                const user = await userService.update(req.params.id, req.body);
                res.json(user);
                console.log('Update user', user);
            } catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({message: err.message});
                } else {
                    res.status(500).json({message: 'An error occurred'});
                }
            }
        }

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sort = req.query.sort as string || 'username_asc';
        const filter = req.query.filter as string || '';

        const startIndex = (page - 1) * limit;

        const users = await userService.findAll(startIndex, limit, sort, filter);

        res.json(users);
        console.log('Get all users');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            res.status(500).json({message: 'An error occurred'});
        }
    }
}



export const findUserById = async (req: Request, res: Response) => {
        try {
            const user = await userService.findUserById(req.params.id);
            res.json(user);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({message: err.message});
            } else {

                res.status(500).json({message: 'An error occurred'});
            }
        }
    }

    export const deleteUserById = async (req: Request, res: Response) => {
        try {
            const user = await userService.deleteUserById(req.params.id);
            res.json(user);
            console.log('Delete user', user);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({message: err.message});
            } else {

                res.status(500).json({message: 'An error occurred'});
            }
        }
    }

export const getPurchaseHistory = async (req: Request, res: Response) => {
    try {
        let token = req.cookies.token?.token;

        let userId = await userService.verifyToken(token);

        if (!userId) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const sort = req.query.sort as string || 'date_asc';
        const filter = req.query.filter as string || '';
        const minTotalPrice = req.query.minTotalPrice as unknown as number || 0;

        const [sortField, sortOrder] = sort.split('_');
        const sortDirection = sortOrder === 'asc' ? 1 : -1;

        const user = await userService.findUserById(userId, sort);
        if (user.orders.length === 0) {
            return res.status(404).json({message: 'No orders found'});
        } else {
            let filteredOrders = filter ? user.orders.filter((order: { productName: string | string[]; }) => order.productName.includes(filter)) : user.orders;
            filteredOrders = filteredOrders.filter((order: { totalPrice: number; }) => order.totalPrice >= minTotalPrice);
            filteredOrders.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => (a[sortField] > b[sortField] ? sortDirection : -sortDirection));
            res.json(filteredOrders);
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            res.status(500).json({message: 'An error occurred'});
        }
    }
}


