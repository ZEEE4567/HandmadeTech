import {Router} from 'express';
import * as cartController from '../controllers/shoppingCartController';
import * as userService from '../services/userService';
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";


export const ShoppingCartAPI = (): any => {
    const router = Router();

    router.use(cookieParser());

    router.use(bodyParser.json({limit: "100mb"}));
    router.use(bodyParser.urlencoded({limit: "100mb", extended: true}));


    router.post('/cart', userService.authorize(['admin', 'user']), cartController.addToCart);
    router.delete('/cart', userService.authorize(['admin', 'user']), cartController.removeFromCart);
    router.get('/cart', userService.authorize(['admin','user']), cartController.getCart);
    router.put('/cart', userService.authorize(['admin','user']), cartController.updateCart);
    router.get('/cart/purchase', userService.authorize(['admin','user']), cartController.purchase);

 return router;
}
