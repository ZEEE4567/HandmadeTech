import {Router} from "express";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as categoryController from "../controllers/categoryController";
import * as userService from "../services/userService";
import * as productsController from "../controllers/productsController";
import * as userController from "../controllers/userController";
import {upload} from "../../middleware/upload";


export const AdminAPI = (): any => {
    const router = Router();

    router.use(cookieParser());

    router.use(bodyParser.json({limit: "100mb"}));
    router.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

    router.post('/categories', userService.authorize(['admin']), categoryController.createCategory);
    router.put('/categories/:id', userService.authorize(['admin']), categoryController.updateCategory);
    router.delete('/categories/:id', userService.authorize(['admin']), categoryController.deleteCategoryById);
    router.post('/products/', userService.authorize(['admin']), upload.single('imageUrl'), productsController.createProduct);
    router.put('/products/:id', userService.authorize(['admin']), productsController.updateProduct);
    router.delete('/products/:id', userService.authorize(['admin']),productsController.deleteProduct);
    router.delete('/users/:id', userService.authorize(['admin']),userController.deleteUserById);
    router.get('/users', userService.authorize(['admin']), userController.getAllUsers);
    router.get('/users/:id', userService.authorize(['admin']), userController.findUserById);
    router.put('/users/:id', userService.authorize(['admin']), userController.updateUserById);
    router.get('/orders', userService.authorize(['admin']), productsController.getOrders);

    return router;
}