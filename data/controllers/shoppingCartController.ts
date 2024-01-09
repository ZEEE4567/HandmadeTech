import {Model} from 'mongoose';

interface ShoppingCartItem {
    product: string;
    quantity: number;
}

interface ShoppingCart {
    user: string;
    items: ShoppingCartItem[];
}

interface ShoppingCartService {
    addToCart: (userId: string, productId: string, quantity: number) => Promise<{
        message: string,
        cart: ShoppingCart
    }>;
    viewCart: (userId: string) => Promise<{ message: string, cart: ShoppingCart | null }>;
    updateCartItem: (userId: string, productId: string, quantity: number) => Promise<{
        message: string,
        cart: ShoppingCart
    }>;
    removeCartItem: (userId: string, productId: string) => Promise<{ message: string, cart: ShoppingCart }>;
}

function ShoppingCartService(ShoppingCartModel: Model<ShoppingCart>): ShoppingCartService {
    let service: ShoppingCartService = {
        addToCart,
        viewCart,
        updateCartItem,
        removeCartItem,
    };

    async function addToCart(userId: string, productId: string, quantity: number): Promise<{
        message: string,
        cart: ShoppingCart
    }> {
        try {
            let cart = await ShoppingCartModel.findOne({user: userId});

            if (!cart) {
                cart = new ShoppingCartModel({user: userId, items: []});
            }

            const existingItem = cart.items.find((item) => item.product.toString() === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({product: productId, quantity});
            }

            await cart.save();

            return {message: 'Item added to the cart', cart};
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }

    async function viewCart(userId: string): Promise<{ message: string, cart: ShoppingCart | null }> {
        try {
            const cart = await ShoppingCartModel.findOne({user: userId});

            if (!cart) {
                return {message: 'Cart is empty', cart: null};
            }

            return {message: 'Cart retrieved successfully', cart};
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }

    async function updateCartItem(userId: string, productId: string, quantity: number): Promise<{
        message: string,
        cart: ShoppingCart
    }> {
        try {
            const cart = await ShoppingCartModel.findOne({user: userId});

            if (!cart) {
                throw new Error('Cart not found');
            }

            const existingItem = cart.items.find((item) => item.product.toString() === productId);

            if (!existingItem) {
                throw new Error('Item not found in the cart');
            }

            existingItem.quantity = quantity;
            await cart.save();

            return {message: 'Item quantity updated', cart};
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }

    async function removeCartItem(userId: string, productId: string): Promise<{ message: string, cart: ShoppingCart }> {
        try {
            const cart = await ShoppingCartModel.findOne({user: userId});

            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.items = cart.items.filter((item) => item.product.toString() !== productId);
            await cart.save();

            return {message: 'Item removed from the cart', cart};
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }

    return service;
}

export default ShoppingCartService;