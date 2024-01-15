import {Router} from "express";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as categoryController from "../controllers/categoryController";
import * as userService from "../services/userService";


export const CategoryAPI = (): any => {
    const router = Router();

    router.use(cookieParser());

    router.use(bodyParser.json({limit: "100mb"}));
    router.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

    router.get('/categories/', userService.authorize(['admin','user']), categoryController.findAllCategories);
    router.get('/categories/id/:id', userService.authorize(['admin', 'user']), categoryController.findCategoryById);
    router.get('/categories/name/:name', userService.authorize(['admin','user']), categoryController.findCategoryByName);

    return router;
}
