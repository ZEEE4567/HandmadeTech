import express, {Router} from 'express';
import * as userService from '../services/userService';

import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";



export const AuthRouter = (): any => {
    const router = Router();

    router.use(cookieParser());

    router.use(bodyParser.json({limit: "100mb"}));
    router.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

    router.post('/register', async (req, res) => {
        try {
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
    });

    router.post('/login', async (req, res) => {
        try {
            const {email, password} = req.body;
            const user = await userService.findUserByEmail(email);
            const isMatch = await userService.comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(400).json({message: 'Invalid credentials'});
            }
            const token = userService.createToken(user);
            res.cookie('token', token, {httpOnly: true});
            res.json({auth: true, token});
        } catch (err) {
            if (err instanceof Error) {

                res.status(500).json({message: err.message});
            } else {
                // handle non-Error objects or throw an exception
                res.status(500).json({message: 'An error occurred'});
            }
        }
    });

    router.get('/me', async (req, res) => {
        try {
            const user = await userService.findUserById(req.body.userId);
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
    });

    router.get('/users',userService.authorize(['member']), async (req, res) => {
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
    });


    router.get('/users/:id', userService.authorize(['admin']), async (req, res) => {
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
    });
    return router;
};


export default AuthRouter;
