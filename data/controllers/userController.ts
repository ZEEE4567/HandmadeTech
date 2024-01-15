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
            // handle non-Error objects or throw an exception
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
            // handle other types of errors or rethrow
            throw err;
        }
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        const user = await userService.findUserByUsername(username);
        const isMatch = await userService.comparePassword(password, user.password);
        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }
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
            // handle non-Error objects or throw an exception
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

        // Verify the token and get the user's ID
        let userId = await userService.verifyToken(token);

        if (!userId) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        // Find the user by their ID
        const user = await userService.findUserById(userId);
        res.json(user);
        console.log('Get me', user);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({message: err.message});
        } else {
            // handle non-Error objects or throw an exception
            res.status(500).json({message: 'An error occurred'});
        }
    }
};

        export const updateSelf = async (req: Request, res: Response) => {
            try {
                let token = req.cookies.token?.token;

                // Verify the token and get the user's ID
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
            const users = await userService.findAll();
            res.json(users);
            console.log('Get all users');
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({message: err.message});
            } else {
                // handle non-Error objects or throw an exception
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
                // handle non-Error objects or throw an exception
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
                // handle non-Error objects or throw an exception
                res.status(500).json({message: 'An error occurred'});
            }
        }
    }

    export const getPurchaseHistory = async (req: Request, res: Response) => {
        try {
            let token = req.cookies.token?.token;

            // Verify the token and get the user's ID
            let userId = await userService.verifyToken(token);

            if (!userId) {
                return res.status(401).json({message: 'Unauthorized'});
            }
            const user = await userService.findUserById(userId);
            res.json(user.orders);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({message: err.message});
            } else {
                // handle non-Error objects or throw an exception
                res.status(500).json({message: 'An error occurred'});
            }
        }
    }


