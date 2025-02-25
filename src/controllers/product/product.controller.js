import {OK} from "../../middlewares/success.middlewar.js";
import AccessService from "../../services/access/access.service.js";
import {ProductFactory} from "../../services/product/product.service.js";

class ProductController {
    createProduct = async (req, res, next) => {
        const payload = {
            ...req.body,
            product_shop: req.user._id,
        }
        new OK({
            message: 'Create Product Success!',
            metadata: await ProductFactory.createProduct(payload),
            options: {
                limit: 100
            }
        }).send(res);
    }

    // Update Prodcut
    updateProduct = async (req, res, next) => {
        const {id, product_type, ...payload} = req.body;
        console.log('payload', payload)
        const productId = req.params.productId

        const metadata = await ProductFactory.updateProduct({
            productId,
            payload,
            type: product_type
        })
        new OK({
            message: 'Update Product Success!',
            metadata,
            options: {
                limit: 100
            }
        }).send(res);
    }
    // Query
    /**
     * @desc Get all drafts product
     * @param {number} limit
     * @param {number} skip
     * @param {string} prodcut_shop
     * @returns {JSON}
     */
    getDraftsForShop = async (req, res, next) => {
        const payload = {
            product_shop: req.user._id,
        }
        new OK({
            message: 'Get list drafts product Success!',
            metadata: await ProductFactory.findAllDraftsForShop(payload),
            options: {
                limit: 100
            }
        }).send(res);
    }


    /**
     * @desc Get all drafts product
     * @param {number} limit
     * @param {number} skip
     * @param {string} prodcut_shop
     * @returns {JSON}
     */
    getPublishedForShop = async (req, res, next) => {
        const payload = {
            product_shop: req.user._id,
        }
        new OK({
            message: 'Get list published product Success!',
            metadata: await ProductFactory.findAllPublishedForShop(payload),
            options: {
                limit: 100
            }
        }).send(res);
    }

    getListSearchProduct = async (req, res, next) => {
        const metadata = await ProductFactory.searchProduct(req.params);

        new OK({
            message: 'Get list product Success!',
            metadata,
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        const metadata = await ProductFactory.findAllProducts(req.query);

        new OK({
            message: 'Get list product Success!',
            metadata,
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        const metadata = await ProductFactory.findProduct({
            product_id: req.params.product_ids
        });
        new OK({
            message: 'Get product Success!',
            metadata,
        }).send(res);
    }
    // End query

    // POST, PUT
    publishedProductById = async (req, res, next) => {
        const {id} = req.params

        const payload = {
            product_shop: req.user._id,
            product_id: id
        }

        const metadata = await ProductFactory.publicProductByShop(payload)

        new OK({
            message: 'published product Success!',
            metadata,
            options: {
                limit: 100
            }
        }).send(res);
    }

    static async ubPublishedProductByShop(req, res, next) {
        const product_id = req.params.id;
        const product_shop = req.user._id;

        const metadata = await ProductFactory.unPublishedBuShop({product_id, product_shop});

        new OK({
            message: 'UnPublished product Successfully!',
            metadata,
        })
    }

}

export default new ProductController()