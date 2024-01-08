const bodyParser = require("body-parser");
const express = require("express");
const Products = require("../data/products");  
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/Token");
const cookieParser = require("cookie-parser");

const ProductsRouter = () => {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.use(cookieParser());
  router.use(VerifyToken);

  router
    .route("/")
    .post(Users.authorize([scopes.Admin]), function (req, res, next) {
      let body = req.body;

      Products.create(body)
        .then(() => {
          console.log("Product Created!");
          // Add any additional logic or notifications here
          res.status(200);
          res.send(body);
          next();
        })
        .catch((err) => {
          console.log("Product already exists!");
          console.log(err.message);
          err.status = err.status || 500;
          res.status(401);
          next();
        });
    })

    .get(Users.authorize([scopes.Admin]), function (req, res, next) {
        console.log("get all products");

        const pageLimit = req.query.limit ? parseInt(req.query.limit) : 5;
        const pageSkip = req.query.skip
          ? pageLimit * parseInt(req.query.skip)
          : 0;

        req.pagination = {
          limit: pageLimit,
          skip: pageSkip,
        };

        Products.findAll(req.pagination)
          .then((products) => {
            const response = {
              auth: true,
              ...products
            };

            console.log("SEND PRODUCTS:", JSON.stringify(response));
            res.send(response);
            next();
          })
          .catch((err) => {
            console.log(err.message);
            next();
          });
      }
    );

  router
    .route("/:productId")
    .get(function (req, res, next) {
      console.log("get a product by id");
      let productId = req.params.productId;
      Products.find(productId)
        .then((product) => {
          res.status(200);
          res.send(product);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .put(Users.authorize([scopes.Admin]), function (req, res, next) {
      console.log("update a product by id");
      let productId = req.params.productId;
      let body = req.body;

      Products.update(productId, body)
        .then((product) => {
          res.status(200);
          res.send(product);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    });
  return router;
};

module.exports = ProductsRouter;
