import { Request, Response, NextFunction } from 'express';
import * as userService from '../data/services/userService';
import { User} from "../data/models/users";



export default (req: Request, res: Response, next: NextFunction): void => {
    const token: string | undefined = req.cookies.token;

    if (!token) {
        res.status(401).send({ auth: false, message: 'No token provided.' });
        return;
    }

    userService.verifyToken( new User,token)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(401).send({ auth: false, message: 'Not authorized' });
        });
};

