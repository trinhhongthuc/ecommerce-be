'use strict'

// Defined the factory
import {clothingModel, electronicModel, productModel} from "../../models/product.model.ts.js";
import {BadRequestError} from "../../middlewares/error.middleware.js";
import {PRODUCT_TYPE} from "../../constants/index.js";
import ProductRepository from "../../repositories/product/product.repository.js";
import {removeUndefinedOrNullObject} from "../../utils/index.ts.js";
import InventoryRepository from "../../repositories/inventory/inventory.repository.js";

class ProductFactory {

    static productRegistry = {}

    static registerProductType = (type, classReferent) => {
        ProductFactory.productRegistry[type] = classReferent;
    }

    static async createProduct(payload) {
        const productType = payload?.product_type;

        const productClass = ProductFactory.productRegistry[productType];
        if (!productClass) throw BadRequestError('Type invalid');

        return new productClass(payload).createProduct();
    }

    static async updateProduct({type, payload, productId}) {
        const productClass = ProductFactory.productRegistry[type];

        if (!productClass) throw BadRequestError('Type invalid');

        return new productClass(payload).updateProduct({productId})

    }

    // Query

    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isDraft: true};

        return await ProductRepository.findAll({query, limit, skip});
    }

    static async findAllPublishedForShop({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isPublished: true};

        return await ProductRepository.findAll({query, limit, skip});
    }

    static async searchProduct(textSearch) {
        return await ProductRepository.searchProduct(textSearch);
    }

    static async findAllProducts({limit, skip, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return await ProductRepository.findAllProduct({
            limit,
            sort,
            page,
            select: ['product_name', 'product_price', 'product_thumb'],
            filter
        })
    }

    static async findProduct({product_id}) {
        return await ProductRepository.findProduct({
            product_id: product_id,
            unSelect: ['__v']
        })
    }

    // End Query

    // PUT, POST
    static async publicProductByShop({product_shop, product_id}) {
        return await ProductRepository.publicProductByShop({product_shop, product_id});
    }

    static async unPublishedBuShop({product_shop, product_id}) {
        return await ProductRepository.unPublishedProductByShop({product_id, product_shop});
    }
}

// Defined basic class
class Product {
    constructor({
                    product_name,
                    product_thumb,
                    product_description,
                    product_quantity,
                    product_price,
                    product_type,
                    product_shop,
                    product_attributes
                }) {

        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_quantity = product_quantity
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // Create New Product
    async createProduct({_id}) {
        const product =  await productModel.create({...this, _id})

        if(product) {
              await InventoryRepository.insertInventory({
                  productId: _id,
                  shopId: this.product_shop,
                  stock: this.product_quantity
              })
        }

        return product;
    }

    async updateProduct({productId, payload}) {
        return await ProductRepository.updateProductById({productId, payload, model: productModel})
    }
}

// Defined sub-clas for different product types clothing
class Clothing extends Product {
    async createProduct() {
        const payload = {
            ...this.product_attributes,
            product_shop: this.product_shop
        };

        const clothing = await clothingModel.create(payload);

        if (!clothing) throw BadRequestError('Create product fail');

        const product = await super.createProduct({_id: clothing._id});

        if (!product) throw BadRequestError('Create product fail');

        return product;
    }

    async updateProduct({productId}) {
        const {product_attributes, ...payload} = removeUndefinedOrNullObject(this);

        if (product_attributes) {
             await ProductRepository.updateProductById({
                productId,
                payload: product_attributes,
                model: clothingModel
            })
        }

        return await super.updateProduct({
            productId,
            payload,
        });
    }
}


// Defined sub-clas for different product types electronic
class Electronic extends Product {
    async createProduct() {
        const payload = {
            ...this.product_attributes,
            product_shop: this.product_shop
        };

        const electronic = await electronicModel.create(payload);

        if (!electronic) throw BadRequestError('Create product fail');
        const product = await super.createProduct({_id: electronic._id});

        if (!product) throw BadRequestError('Create product fail');

        return product;
    }

    async updateProduct({productId}) {
        const {product_attributes, ...payload} = removeUndefinedOrNullObject(this);

        if (product_attributes) {
             await ProductRepository.updateProductById({
                productId,
                payload: product_attributes,
                model: electronicModel
            })
        }

        return await super.updateProduct({
            productId,
            payload,
        });
    }
}

class Furniture extends Product {
    async createProduct() {
        const payload = {
            ...this.product_attributes,
            product_shop: this.product_shop
        };

        const furniture = await clothingModel.create(payload);

        if (!furniture) throw BadRequestError('Create product fail');

        const product = await super.createProduct({_id: furniture._id});

        if (!product) throw BadRequestError('Create product fail');

        return product;
    }
}


ProductFactory.registerProductType(PRODUCT_TYPE.CLOTHING, Clothing);
ProductFactory.registerProductType(PRODUCT_TYPE.ELECTRONIC, Electronic);
ProductFactory.registerProductType(PRODUCT_TYPE.FURNITURE, Furniture);

export {ProductFactory}


// extends: Là kế thừa từ lớp cha
// Implements: là một lớp phải có tất cả thể hiện của interface implements(Định nghĩa để class có tất cả phương thức chung và quy tắt chung)
// abstract: cũng là địng nghĩa các phương thức và quy tắt chung, nhưng phải sử dụng qua extends từ sub-class