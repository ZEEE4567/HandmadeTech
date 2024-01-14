import {Router} from "express";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as productsController from "../controllers/productsController";
import * as userService from "../services/userService";

export const ProductsAPI = (): any => {
    const router = Router();

    router.use(cookieParser());

    router.use(bodyParser.json({limit: "100mb"}));
    router.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

    router.post('/products/', userService.authorize(['admin']), productsController.createProduct);
    router.put('/products/:id', userService.authorize(['admin']), productsController.updateProduct);
    router.delete('/products/:id', userService.authorize(['admin']),productsController.deleteProduct);
    router.get('/products/', userService.authorize(['admin', 'logged', 'anonymous']), productsController.getProducts);
    router.get('/products/:id', userService.authorize(['admin', 'logged', 'anonymous']), productsController.getProductById);
    router.get('/products/category/:category', userService.authorize(['admin', 'logged', 'anonymous']), productsController.getProductsByCategory);



    //router.post('/users/me/avatar', userController.uploadAvatar, userController.uploadAvatarError, userController.uploadAvatarSuccess);
    //router.delete('/users/me/avatar', userController.deleteAvatar);
    //router.get('/users/:id/avatar', userController.getAvatar);

    return router;
}