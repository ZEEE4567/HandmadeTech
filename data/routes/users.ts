import {Router} from "express";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as userController from "../controllers/userController";
import * as userService from "../services/userService";
import {verifyToken} from "../controllers/userController";


export const UsersAPI = (): any => {
    const router = Router();

    router.use(cookieParser());

    router.use(bodyParser.json({limit: "100mb"}));
    router.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

    router.post('/users/register', userController.register);
    router.post('/users/login', userController.login);
    router.get('/users/logout', userController.logout);
    router.get('/users/me', userController.findMe);
    router.put('/users/me', userController.updateSelf);
    router.delete('/users/:id', userService.authorize(['admin']),userController.deleteUserById);
    router.get('/users', userService.authorize(['admin']), userController.getAllUsers, userController.verifyToken);
    router.get('/users/:id', userService.authorize(['admin']), userController.findUserById, userController.verifyToken);
    router.put('/users/:id', userService.authorize(['admin']), userController.updateUserById, userController.verifyToken);
    //router.post('/users/me/avatar', userController.uploadAvatar, userController.uploadAvatarError, userController.uploadAvatarSuccess);
    //router.delete('/users/me/avatar', userController.deleteAvatar);
    //router.get('/users/:id/avatar', userController.getAvatar);


    return router;

}
