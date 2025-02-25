'use strict'

// HXX là gì, Injection là gì
import {BadRequestError, NotFoundRequestError} from "../../middlewares/error.middleware.js";
import DiscountRepository from "../../repositories/discount/discount.repository.js";
import ProductRepository from "../../repositories/product/product.repository.js";
import DiscountModel from "../../models/discount.model.js";

class DiscountService {
    // Generator discount code [Shop | Admin]
    // Get Discount amount [User]
    // Get All Discount Code [User | Shop]
    // Verify Discount Code
    // Delete Discount code
    // Cancel Discount

    static async createDiscountCode(payload) {
        const {
            discount_code,
            discount_start_date,
            discount_end_date,
            discount_value,
            discount_is_active,
            discount_shop_id,
            discount_min_order_value,
            discount_product_ids,
            discount_applies_to,
            discount_name,
            discount_description,
            discount_type,
            discount_max_value,
            discount_max_uses,
            discount_uses_count,
            discount_max_uses_per_user,
            discount_uses_used
        } = payload;

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) throw new BadRequestError('Discount code has expired');

        if (new Date(discount_start_date) >= new Date(discount_end_date)) throw new BadRequestError('Start date must be before End date')
        // Create index for discount code
        const filterDiscountParams = {
            discount_code,
            discount_shop_id,
        };

        const foundDiscount = await this.#findDiscount(filterDiscountParams);

        if (foundDiscount && !foundDiscount.discount_is_active) throw new BadRequestError('Discount is Exists');

        const discountPayload = {
            discount_name,
            discount_description,
            discount_type,
            discount_code,
            discount_value,
            discount_min_order_value,
            discount_max_value,
            discount_start_date,
            discount_end_date,
            discount_max_uses,
            discount_uses_count,
            discount_uses_used,
            discount_shop_id,
            discount_max_uses_per_user,
            discount_is_active,
            discount_applies_to,
            discount_product_ids: discount_applies_to === 'ALL' ? [] : discount_product_ids
        }
        return await DiscountRepository.createDiscount(discountPayload);
    }

    static async updateDiscount() {
    }

    // Get All discount  available with product of user
    static async getAllDiscountCodesWithProduct(queryParams) {
        const {
            code, shopId, userId, limit, page
        } = queryParams;

        const filterDiscountParams = {
            discount_code: code,
            discount_shop_id: shopId
        }
        const {
            discount_is_active,
            discount_applies_to,
            discount_product_ids
        } = await this.#findDiscount(filterDiscountParams);

        if (!discount_is_active) throw new NotFoundRequestError('Discount not exists');

        let products = null;

        if (discount_applies_to === 'ALL') {
            // Get All Product
            const filter = {
                product_shop: shopId,
                isPublished: true,
            }
            products = await ProductRepository.findAllProduct({
                filter,
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }


        if (discount_applies_to === 'SPECIFIC') {
            const filter = {
                _id: {
                    $in: discount_product_ids
                },
                isPublished: true,
            }

            products = await ProductRepository.findAllProduct({
                filter,
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })

        }

        return products;
    }

    static async getAllDiscountCodesByShop(body) {
        const {limit = 50, page, shopId} = body;

        const filter = {
            discount_shop_id: shopId,
            discount_is_active: true
        }

        return await DiscountRepository.findAllDiscountCodeUnSelect({
            limit: +limit, filter, unselect: ['__v', 'discount_shop_id'], model: DiscountModel, page: +page
        });
    }

    static async getDiscountAmount(queryParams) {
        const {codeId, userId, shopId, productId, products} = queryParams;
        const filter = {
            discount_shop_id: shopId,
            discount_code: codeId
        };
        const foundDiscount = await this.#findDiscount(filter);

        if (!foundDiscount) throw new NotFoundRequestError('Discount code not valid, Please check it!');

        const {
            discount_is_active,
            discount_start_date,
            discount_end_date,
            discount_value,
            discount_max_uses,
            discount_type,
            discount_user_used,
            discount_min_order_value,
            discount_max_uses_per_user
        } = foundDiscount

        if (!discount_is_active) throw new BadRequestError('Discount not valid!');

        if (discount_max_uses === 0) throw new BadRequestError('Can"t using discount!!');

        if (new Date() < new Date(discount_start_date) || new Date(discount_start_date) >= new Date(discount_end_date)) throw new BadRequestError('Discount expired');


        let totalOrder = 0

        if (discount_min_order_value) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.product_quantity * product.product_price)
            }, 0)

            if (totalOrder < discount_min_order_value) throw new BadRequestError('Total order less than Min order!!!');
        }

        if (discount_max_uses_per_user > 0) {
            const userUsed = discount_user_used.includes(userId);
            if (userUsed) throw new BadRequestError('User Used the discount code');
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : (totalOrder * discount_value) / 100;

        // Tiền 900k, giảm giá 10% => 90k
        // 100 * 10 / 1000
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }

    }

    static async deleteDiscount(body) {
        const {shopId, codeId} = body
        return DiscountRepository.deleteDiscount({shopId, codeId})
    }

    static async cancelDiscount(body) {
        const {codeId, shopId, userId} = body;
        const filter = {
            discount_code: codeId,
            discount_shop_id: shopId,
        }
        const foundDiscount = await this.#findDiscount(filter);

        if (!foundDiscount) throw new BadRequestError('Discount not exists');

        const updateFilter = {
            $pull: {
                discount_uses_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        }
        return await DiscountRepository.cancelDiscount({id: foundDiscount._id, updateFilter})
    }

    // Private Function
    async #findDiscount(filter) {
        return await DiscountRepository.findDiscount(filter)
    }
}

export default DiscountService;
