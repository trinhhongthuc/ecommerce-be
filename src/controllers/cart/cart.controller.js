import CartService from "../../services/cart/cart.service.js";
import {OK} from "../../middlewares/success.middlewar.js";

class CartController {
    static async addProductToCart(req, res, next) {
        const {userId, product} = req.body
        const metadata = await CartService.addProductToCart({userId, product})

        new OK({
            message: 'Add Product to cart successfully!!',
            metadata,
        }).send(res)
    }

    static async addProductExistToCart(req, res, next) {
        const {userId, product} = req.body
        const metadata = await CartService.addProductExistToCart({userId, product})
        const metadata2 = await CartService.addProductExistToCart({userId, product})

        new OK({
            message: 'Update Product to cart successfully!!',
            metadata,
            metadata2
        }).send(res)
    }

    static async getListUserCart(req, res, next) {
        const {userId} = req.query
        const metadata = await CartService.getListUserCart({userId})

        new OK({
            message: 'List successfully!!',
            metadata,
        }).send(res)
    }
}

export default CartController