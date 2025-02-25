import CartRepository from "../../repositories/cart/cart.repository.js";
import ProductRepository from "../../repositories/product/product.repository.js";
import {BadRequestError} from "../../middlewares/error.middleware.js";
import cartModel from "../../models/cart.model.js";

class CartService {
    // Add product To cart
    // Reduce product quantity by one
    // Increase product by one
    // get Cart
    // Delete all product
    // Delete one product

    static async addProductToCart(body) {
        // Two case:
        // 1: Product not exists in the cart
        // 2: Product Exists in the cart

        const {userId, product} = body;

        const filterUserCart = {
            cart_user_id: userId
        }

        const userCart = await CartRepository.findUserCart(filterUserCart);

        if (!userCart) {
            // Create cart
            const payload = {
                userId,
                product
            }
            return CartRepository.createUserCart(body);
        }

        if (!userCart.cart_product.length) {
            userCart.cart_product = [product]
            return await userCart.save();
        }

        userCart.cart_product = userCart.cart_product.map(productItem => {
            if (productItem === product.id) {
                return ({...productItem, quantity: product.quantity})
            }

            return productItem;
        })

        return await userCart.save()
    }

    /*
        shop_order_ids: [
            {
                shopId,
                item_product: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version,
            }
        ]
    */
    static async addProductExistToCart(body) {
        const {userId, product} = body;

        const {quantity} = product

        const foundProduct = await ProductRepository.findProductById(product._id)

        if (!foundProduct) throw new BadRequestError('Product not exists!!');

        const {product_is_active, product_shop} = foundProduct

        if (!product_is_active) throw new BadRequestError('Product not exists!!');

        if (product_shop !== product.product_shop) throw new BadRequestError('Product do not belong to the shop!!');

        if (quantity === 0) {
            // Delete product
            return await this.#deleteProductToCart({userId, productId: product._id})
        }

        const filterUserCart = {
            cart_user_id: userId
        }

        const userCart = await CartRepository.findUserCart(filterUserCart);

        userCart.cart_product = userCart.cart_product.map(productItem => {
            if (productItem._id === product._id) {
                return {
                    ...productItem,
                    product_quantity: product.quantity
                }
            }

            return productItem
        })

        userCart.save();

        return userCart.cart_product
    }

    static async getListUserCart(params) {
        const {userId} = params
        return await CartRepository.findListUserCart(userId)
    }


    // Private Method
     async #deleteProductToCart(body) {
        const {userId, productId} = body
        const query = {
            cart_user_id: userId,
            cart_state: 'ACTIVE'
        };

        const upset = {
            $pull: {
                cart_product: {
                    productId
                }
            }
        }

        return await CartRepository.updateCard({query, upset});
    }
}

export default CartService;