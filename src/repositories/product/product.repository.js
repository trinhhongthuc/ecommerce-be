import {productModel} from "../../models/product.model.ts.js";
import {getInfoData, getSelectData, getUnSelectData} from "../../utils/index.ts.js";

class ProductRepository {
    static async findAll({query, limit, skip}) {
        return productModel.find(query).populate('product_shop', "name email -_id")
            .sort({updateAt: -1})
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()

    }

    static async findAllProduct({limit, sort, page, filter, select}) {
        const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
        const skip = (page - 1) * limit;

        const productList = await productModel.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(getSelectData(select))
            .lean()

        return productList;
    }

    static async findProduct({product_id, unSelect = []}) {
        return productModel.findById(product_id).select(getUnSelectData(unSelect));
    }

    static async updateProductById({productId, payload, model, isNew = true}) {
        return model.findByIdAndUpdate(productId, payload, {
            new: isNew
        })
    }

    static async searchProduct(textSearch) {
        const regexSearch = new RegExp(textSearch);

        return productModel.find({
            isPublished: true,
            $text: {
                $search: regexSearch
            }
        }, {
            score: {$meta: 'textScore'}
        }).sort({
            score: {$meta: 'textScore'}
        }).lean();
    }

    static async publicProductByShop({product_id, product_shop}) {
        const product = await productModel.findOne({
            product_shop: product_id,
            _id: product_id
        });

        if (!product) return null;

        product.isDraft = false;
        product.isPublished = true

        const {modifiedCount} = product.updateOne(product)

        return modifiedCount;
    }

    static async unPublishedProductByShop({product_id,})  {
        const product = await productModel.findOne({
            product_shop: product_shop,
            _id: product_id
        })

        if (!product) return null;

        product.isDraft = true;
        product.isPublished = false;

        const {modifiedCount} = product.updateOne(product);

        return modifiedCount;
    }

    static async findProductById(productId) {
        return productModel.findById(productId)

    }

    static async checkProductValid(products) {
        return await Promise.all(products.map(async (product) => {
            const foundProduct = await productModel.findById(product._id);

            if (!foundProduct) return null;

            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product._id
            }
        }))
    }
}

export default ProductRepository;