import discountModel from "../../models/discount.model.js";
import {productModel} from "../../models/product.model.ts.js";
import {getSelectData, getUnSelectData} from "../../utils/index.ts.js";

class DiscountRepository {
    static async findDiscount(filter) {
        return await discountModel.findOne(filter).lean()
    }

    static async createDiscount(payload) {
        return await discountModel.create(payload)
    }

    static async findAllDiscountCodeUnSelect(params) {
        const {limit = 50, sort = 'ctime', filter, unselect, model, page} = params

        const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
        const skip = (page - 1) * limit;

        return await model.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(getUnSelectData(unselect))
            .lean()

    }

    static async findAllDiscountCodeSelect(params) {
        const {limit = 50, sort = 'ctime', filter, select, model, page} = params

        const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
        const skip = (page - 1) * limit;

        return await model.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(getSelectData(select))
            .lean()

    }

    static async deleteDiscount(params) {
        const {shopId, codeId} = params

        return discountModel.findOneAndDelete({
            discount_shop_id: shopId,
            discount_code: codeId
        })
    }

    static async cancelDiscount({id, updateFilter}) {
        return discountModel.findByIdAndUpdate(id, updateFilter);
    }
}

export default DiscountRepository;