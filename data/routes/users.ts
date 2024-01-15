import {Router} from "express";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as userController from "../controllers/userController";
import * as userService from "../services/userService";



export const UsersAPI = (): any => {
    const router = Router();

    router.use(cookieParser());

    router.use(bodyParser.json({limit: "100mb"}));
    router.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

    router.post('/users/register', userController.register);
    router.post('/users/login', userController.login);
    router.get('/users/logout', userService.authorize(['admin', 'user']), userController.logout);
    router.get('/users/me',userService.authorize(['admin', 'user']), userController.getProfile);
    router.put('/users/me', userService.authorize(['admin', 'user']), userController.updateSelf);
    router.get('/users/orders', userService.authorize(['admin', 'user']), userController.getPurchaseHistory);



    return router;

}
