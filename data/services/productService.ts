import {Product} from '../models/products';



export const createProduct = async (body: any) => {
    try {
        const product = new Product({
            name: body.name,
            imageUrl: body.imageUrl,
            description: body.description,
            price: body.price,
            category: body.category,
        });
        await product.save();
        return product;
    }
    catch (err) {
        throw err;
    }
}


export const findProductsByCategory = async (category: string) => {
    try {
        return await Product.find({ 'category.category': category });

    } catch (err) {
        console.error(err);
        throw err;
    }
}



export const deleteProductById = async (productId: string) => {
    try {
        const product = await Product.findByIdAndDelete(productId);
        return product;
    }
    catch (err) {
        throw err;
    }
}

export const findAllProducts = async () => {
    try {
        const products = await Product.find();
        console.log(products)
        return products;

    }
    catch (err) {
        throw err;
    }
}

export const findProductById = async (productId: string) => {
    try {
        console.log(`Input: ${productId}`);
        const product = await Product.findById(productId);
        console.log(`Output: ${JSON.stringify(product)}`);
        return product;
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
        product.imageUrl = body.imageUrl;
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
