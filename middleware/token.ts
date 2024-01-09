import {Request, Response, NextFunction} from 'express';
import Users from '../data/users';

export default (req: Request, res: Response, next: NextFunction): void => {
    let token: string = req.cookies.token;

    if (!token) {
        res.status(401).send({auth: false, message: 'No token provided.'});
        return;
    }

    Users.verifyToken(token)
        .then((decoded: any) => {
            req.id = decoded.id;
            req.roleUser = decoded.role;
            next();
        })
        .catch(() => {
            res.status(401).send({auth: false, message: 'Not authorized'});
        });
};