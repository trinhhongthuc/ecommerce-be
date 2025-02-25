import express from "express";
import {authenticateV2} from "../../auth/authUtils.js";
import CartController from "../../controllers/cart/cart.controller.js";
import {asyncHandler} from "../../helpers/asyncHandler.helper.js";

const router = express.Router();

router.use(authenticateV2);

// This is cart
router.post('/add-to-cart', asyncHandler(CartController.addProductToCart))
router.put('/update-product-in-cart', asyncHandler(CartController.addProductExistToCart))
router.get('/carts', asyncHandler(CartController.getListUserCart))

export default router;