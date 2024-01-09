function ShoppingCartService(ShoppingCartModel) {
    let service = {
      addToCart,
      viewCart,
      updateCartItem,
      removeCartItem,
    };
  
    async function addToCart(userId, productId, quantity) {
      try {
        let cart = await ShoppingCartModel.findOne({ user: userId });
  
        if (!cart) {
          cart = new ShoppingCartModel({ user: userId, items: [] });
        }
  
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
  
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ product: productId, quantity });
        }
  
        await cart.save();
  
        return { message: 'Item added to the cart', cart };
      } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
      }
    }
  
    async function viewCart(userId) {
      try {
        const cart = await ShoppingCartModel.findOne({ user: userId });
  
        if (!cart) {
          return { message: 'Cart is empty', cart: null };
        }
  
        return { message: 'Cart retrieved successfully', cart };
      } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
      }
    }
  
    async function updateCartItem(userId, productId, quantity) {
      try {
        const cart = await ShoppingCartModel.findOne({ user: userId });
  
        if (!cart) {
          throw new Error('Cart not found');
        }
  
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
  
        if (!existingItem) {
          throw new Error('Item not found in the cart');
        }
  
        existingItem.quantity = quantity;
        await cart.save();
  
        return { message: 'Item quantity updated', cart };
      } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
      }
    }
  
    async function removeCartItem(userId, productId) {
      try {
        const cart = await ShoppingCartModel.findOne({ user: userId });
  
        if (!cart) {
          throw new Error('Cart not found');
        }
  
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
  
        return { message: 'Item removed from the cart', cart };
      } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
      }
    }
  
    return service;
  }
  
  module.exports = ShoppingCartService;
  