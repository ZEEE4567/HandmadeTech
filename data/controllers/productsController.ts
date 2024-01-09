import {Model} from 'mongoose';

interface Product {
    // Define the properties of a product
}

interface Pagination {
    limit: number;
    skip: number;
}

interface ProductService {
    create(product: Product): Promise<{ message: string; product: Model<Product> }>;

    findAll(pagination: Pagination): Promise<{
        data: Model<Product>[];
        pagination: {
            pageSize: number;
            page: number;
            hasMore: boolean;
            total: number;
        };
    }>;

    findById(productId: string): Promise<Model<Product>>;

    findProductsByCategory(category: string): Promise<Model<Product>[]>;

    update(id: string, product: Product): Promise<Model<Product>>;

    removeById(id: string): Promise<void>;
}

function ProductService(ProductModel: Model<Product>): ProductService {
    let service: ProductService = {
        create,
        findAll,
        findById,
        findProductsByCategory,
        update,
        removeById,
    };

    function create(product: Product): Promise<{ message: string; product: Model<Product> }> {
        let newProduct = ProductModel(product);
        return save(newProduct);
    }

    function save(model: Model<Product>): Promise<{ message: string; product: Model<Product> }> {
        return new Promise(function (resolve, reject) {
            model.save(function (err) {
                if (err) reject("There is a problem with registering the product");

                resolve({
                    message: "Product Created",
                    product: model,
                });
            });
        });
    }

    async function findAll(pagination: Pagination): Promise<{
        data: Model<Product>[];
        pagination: {
            pageSize: number;
            page: number;
            hasMore: boolean;
            total: number;
        };
    }> {
        const {limit, skip} = pagination;

        const products_1 = await new Promise(function (resolve, reject) {
            ProductModel.find({}, {}, {skip, limit}, function (err, products) {
                if (err) reject(err);

                resolve(products);
            });
        });
        const totalProducts = await ProductModel.count();
        return {
            data: products_1,
            pagination: {
                pageSize: limit,
                page: Math.floor(skip / limit),
                hasMore: skip + limit < totalProducts,
                total: totalProducts,
            },
        };
    }

    function findById(productId: string): Promise<Model<Product>> {
        return new Promise(function (resolve, reject) {
            ProductModel.findById(productId, function (err, products) {
                if (err) reject(err);

                if (!products) {
                    reject("Products not found");
                }
                resolve(products);
            });
        });
    }

    function findProductsByCategory(category: string): Promise<Model<Product>[]> {
        return new Promise(function (resolve, reject) {
            ProductModel.find({category}, function (err, products) {
                if (err) reject(err);

                if (!products || products.length === 0) {
                    reject("Products not found for the given category");
                }

                resolve(products);
            });
        });
    }

    function update(id: string, product: Product): Promise<Model<Product>> {
        return new Promise(function (resolve, reject) {
            ProductModel.findByIdAndUpdate(id, product, function (err, productUpdated) {
                if (err) reject("Product update failed");
                resolve(productUpdated);
            });
        });
    }

    function removeById(id: string): Promise<void> {
        return new Promise(function (resolve, reject) {
            ProductModel.findByIdAndRemove(id, function (err) {
                if (err)
                    reject({
                        message: "Unable to remove product",
                    });

                resolve();
            });
        });
    }

    return service;
}

export default ProductService;