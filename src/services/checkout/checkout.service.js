import CartRepository from "../../repositories/cart/cart.repository.js";
import {BadRequestError} from "../../middlewares/error.middleware.js";
import ProductRepository from "../../repositories/product/product.repository.js";
import DiscountService from "../discount/discount.service.js";

class CheckoutService {
    static async checkoutReview(body) {
        const {cartId, shopOrderIds, userId} = body;
        const foundCart = await CartRepository.findCartById(cartId);

        if (!foundCart) throw new BadRequestError('Cart dose not exists');

        const checkoutOrder = {
            totalPrice: 0,
            freeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }

        const newShopOrderIds = [];

        for (let i = 0; i < shopOrderIds.length; i++) {
            const {shopId, shopDiscounts = [], itemProducts = []} = shopOrderIds[i];

            const checkoutProductValid = await ProductRepository.checkProductValid(itemProducts);

            if (!checkoutProductValid) throw new BadRequestError('Order Fail');

            // Total order
            const checkoutPrice = checkoutProductValid.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0);

            checkoutOrder.totalPrice += checkoutPrice;

            const itemsCheckout = {
                shopId,
                shopDiscounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                itemProducts: checkoutProductValid
            }

            if (shopDiscounts.length > 0) {
                const {
                    totalOrder,
                    discount,
                    totalPrice
                } = await DiscountService.getDiscountAmount({
                    codeId: shopDiscounts[0].codeId,
                    userId,
                    shopId,
                    products: checkoutProductValid
                })

                checkoutOrder.totalDiscount += discount;
                if (discount > 0) {
                    itemsCheckout.priceApplyDiscount = checkoutPrice - discount;
                }

            }

            checkoutOrder.totalCheckout += itemsCheckout.priceApplyDiscount

            newShopOrderIds.push(checkoutOrder)
        }

        return {
            newShopOrderIds, shopOrderIds, checkoutOrder
        }
    }
}

export default CheckoutService