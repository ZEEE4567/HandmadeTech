import {IProduct, Product} from '../models/products';
export const createProduct = async (product: IProduct) => {
    try {
        const newProduct = new Product(product);
        return await newProduct.save();
    }
    catch (err) {
        throw err;
    }
}
export const findAll = async () => {
    try {
        return await Product.find();
    }
    catch (err) {
        throw err;
    }
}

export const findProductById = async (productId: string) => {
    try {
        return await Product.findById(productId);
    }
    catch (err) {
        throw err;
    }
}

export const update = async (productId: string, body: any) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error("Product not found");
        }
        product.name = body.name;
        product.image = body.image;
        product.description = body.description;
        product.price = body.price;
        product.category = body.category;
        await product.save();

        return {message: "Product updated", product};
    }
    catch (error) {
        console.error(error);
        throw new Error("Internal Server Error");
    }
}
