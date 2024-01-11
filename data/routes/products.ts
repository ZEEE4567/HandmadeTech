/*import express, { Request, Response, NextFunction, Router } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {Product} from "../models/products";
import Users from "../users";
import {scopes} from "../models/users";
import VerifyToken from "../../middleware/token";

const ProductsRouter = (): Router => {
    let router = express();

    router.use(bodyParser.json({ limit: "100mb" }));
    router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

    router.use(cookieParser());
    router.use(VerifyToken);

    router
        .route("/products1")
        .post(
            Users.authorize([scopes.Admin]),
            function (req: Request, res: Response, next: NextFunction) {
                let body: any = req.body;

                Product.create(body)
                    .then(() => {
                        console.log("Product Created!");
                        // Add any additional logic or notifications here
                        res.status(200);
                        res.send(body);
                        next();
                    })
                    .catch((err: Error) => {
                        console.log("Product already exists!");
                        console.log(err.message);
                        err.status = err.status || 500;
                        res.status(401);
                        next();
                    });
            }
        );

    router
        .route("/products2")
        .get(
            Users.authorize([scopes.Admin]),
            function (req: Request, res: Response, next: NextFunction) {
                console.log("get all products");

                const pageLimit = req.query.limit ? parseInt(req.query.limit as string) : 5;
                const pageSkip = req.query.skip
                    ? pageLimit * parseInt(req.query.skip as string)
            : 0;

                req.pagination = {
                    limit: pageLimit,
                    skip: pageSkip,
                };

                Product.findAll(req.pagination)
                    .then((products) => {
                        const response = {
                            auth: true,
                            ...products,
                        };

                        console.log("SEND PRODUCTS:", JSON.stringify(response));
                        res.send(response);
                        next();
                    })
                    .catch((err: Error) => {
                        console.log(err.message);
                        next();
                    });
            }
        );

    router
        .route("/products3/:productId")
        .get(function (req: Request, res: Response, next: NextFunction) {
            console.log("get a product by id");
            let productId: string = req.params.productId;
            Product.findById(productId)
                .then((product) => {
                    res.status(200);
                    res.send(product);
                    next();
                    console.log("PRODUCT", productId);
                })
                .catch((err: Error) => {
                    res.status(404);
                    next();
                });
        })
        .put(
            Users.authorize([scopes.Admin]),
            function (req: Request, res: Response, next: NextFunction) {
                console.log("update a product by id");
                let productId: string = req.params.productId;
                let body: any = req.body;

                Product.update(productId, body)
                    .then((product) => {
                        res.status(200);
                        res.send(product);
                        next();
                    })
                    .catch((err: Error) => {
                        res.status(404);
                        next();
                    });
            }
        );

    return router;
};

export default ProductsRouter;

 */