import express from "express";
import {permission, apiKey} from "../../auth/checkAuth.js";
import {authenticateV2} from "../../auth/authUtils.js";
import {asyncHandler} from "../../helpers/asyncHandler.helper.js";
import productController from "../../controllers/product/product.controller.js";

const router = express.Router()

// Query Outside authenticate

router.get('/search', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))

// Check api key
router.use(authenticateV2);

router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/published/:id', asyncHandler(productController.publishedProductById))
router.post('/unpublished/:id', asyncHandler(productController.getPublishedForShop))

// Query
router.get('/draft/all', asyncHandler(productController.getDraftsForShop))
router.get('/published/all', asyncHandler(productController.getDraftsForShop))


export default router;