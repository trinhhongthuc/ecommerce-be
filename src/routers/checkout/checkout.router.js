import express from "express";
import {authenticateV2} from "../../auth/authUtils.js";
import CheckoutController from "../../controllers/checkout/checkout.controller.js";
import {asyncHandler} from "../../helpers/asyncHandler.helper.js";

const router = express.Router()

router.use(authenticateV2);

router.post('/review', asyncHandler(CheckoutController.checkout));

export default router;