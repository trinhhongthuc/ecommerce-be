'use strict'

import {OK} from "../middlewares/success.middlewar.js";
import {ProductFactory} from "../services/product/product.service.js";
import DiscountService from "../services/discount/discount.service.js";

class DiscountController {
    static async createDiscountCode(req, res, next) {
        const payload = {
            ...req.body,
            discount_shop_id: req.user._id
        }
        const metadata = await DiscountService.createDiscountCode(payload);

        new OK({
            message: 'Create discount code Success!',
            metadata
        }).send(res);
    }


    static async getAllDiscountCode(req, res, next) {
        const payload = {
            shopId: req.user._id,
            ...req.query
        }
        const metadata = await DiscountService.getAllDiscountCodesByShop(payload);

        new OK({
            message: 'Create discount code Success!',
            metadata
        }).send(res);
    }

    static async getDiscountAmount(req, res, next) {
        const metadata = await DiscountService.getDiscountAmount(req.query);

        new OK({
            message: 'Create discount code Success!',
            metadata
        }).send(res);
    }

    static async getAllDiscountCodeWithProduct(req, res, next) {
        const metadata = await DiscountService.getAllDiscountCodesWithProduct(req.query);

        new OK({
            message: 'Create discount code Success!',
            metadata
        }).send(res);
    }

    static async deleteDiscount(req, res, next) {
        const metadata = await DiscountService.deleteDiscount(req.body);

        new OK({
            message: 'Create discount code Success!',
            metadata
        }).send(res);
    }


    static async cancelDiscount(req, res, next) {
        const metadata = await DiscountService.cancelDiscount(req.body);

        new OK({
            message: 'Create discount code Success!',
            metadata
        }).send(res);
    }
}

export default DiscountController