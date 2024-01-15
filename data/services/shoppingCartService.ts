import { ICart } from '../models/shoppingCart';
import { IProduct, Product } from '../models/products';
import { IUser, User } from '../models/users';
import { Cart } from "../models/shoppingCart";
import {Order} from "../models/orders";

export const addToCart = async (userId: IUser['_id'], productId: IProduct['_id'], quantity: number): Promise<ICart> => {
    const product = await Product.findById(productId); // Fetch the product details
    if (!product) {
        throw new Error('Product not found');
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        const newCart = new Cart({
            userId,
            products: [productId],
            quantities: [quantity],
            totalPrice: product.price * quantity, // Calculate the total price
        });
        await newCart.save();
        return newCart.populate('products', 'userId');
    }

    cart.products.push(productId);
    cart.quantities.push(quantity);
    cart.totalPrice += product.price * quantity; // Update the total price
    await cart.save();
    return cart.populate({ path: 'products', populate: { path: 'category' }})
}

export const removeFromCart = async (userId: IUser['_id'], productId: IProduct['_id']): Promise<ICart> => {
    const product = await Product.findById(productId); // Fetch the product details
    if (!product) {
        throw new Error('Product not found');
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new Error('Cart not found');
    }

    const productIndex = cart.products.indexOf(productId);
    if (productIndex > -1) {
        const productQuantity = cart.quantities[productIndex];
        cart.products.splice(productIndex, 1);
        cart.quantities.splice(productIndex, 1);
        cart.totalPrice -= product.price * productQuantity;
        await cart.save();
    }
    return cart.populate({ path: 'products', populate: { path: 'category' }});
}


export const purchase = async (userId: IUser['_id']): Promise<IUser> => {
    const cart = await Cart.findOne({ userId }).populate('products');
    if (!cart) {
        throw new Error('Cart not found');
    }

    // Create a new order
    const newOrderData = {
        products: cart.products,
        quantities: cart.quantities,
        totalPrice: cart.totalPrice,
        date: new Date(),
    };

    // Save the order to the orders collection
    const newOrder = new Order(newOrderData);
    await newOrder.save();


    // Add the order to the user's purchase history
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.orders.push(newOrder);
    await user.save();

    // Clear the cart
    cart.products = [];
    cart.quantities = [];
    cart.totalPrice = 0;
    await cart.save();

    return user;
};


export const getCart = async (userId: IUser['_id']): Promise<ICart> => {
    const cart = await Cart.findOne({ userId })
        .populate({
            path: 'products',
            populate: { path: 'category' }
        })
        .populate('userId');
    if (!cart) {
        throw new Error('Cart not found');
    }
    return cart;
}

export const updateCart = async (userId: IUser['_id'], productId: IProduct['_id'], quantity: number): Promise<ICart> => {
    // Fetch the user's cart from the database
    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
        throw new Error('Cart not found');
    }

    let product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    // Find the index of the product in the cart
    let productIndex = cart.products.indexOf(productId);
    if (!productIndex) {
        throw new Error('Product not found in cart');
    }

    if (productIndex !== -1) {
        // If the product is in the cart, update the quantity
        if (quantity > 0) {
            cart.quantities[productIndex] = quantity;
        } else {
            // If the quantity is 0 or less, remove the product from the cart
            cart.products.splice(productIndex, 1);
            cart.quantities.splice(productIndex, 1);
        }
    }
    cart.totalPrice = 0;
    for (let i = 0; i < cart.products.length; i++) {
        let product = await Product.findById(cart.products[i]);
        if (product) {
            cart.totalPrice += product.price * cart.quantities[i];
        } else {
            console.error(`Product with ID ${cart.products[i]} not found`);
        }
    }


    // Save the updated cart to the database
    await cart.save();

    return cart.populate({ path: 'products', populate: { path: 'category' }});
}

