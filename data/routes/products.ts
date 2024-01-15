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

    router.get('/products', userService.authorize(['admin', 'user']), productsController.getProducts);
    router.get('/products/search', userService.authorize(['admin', 'user']), productsController.searchProducts);
    router.get('/products/:id', userService.authorize(['admin','user']), productsController.getProductById);
    router.get('/products/category/:category', userService.authorize(['admin', 'user']), productsController.getProductsByCategory);






    return router;
}