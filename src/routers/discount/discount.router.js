'use strict'

import express from "express";
import {authenticateV2} from "../../auth/authUtils.js";
import DiscountController from "../../controllers/discount.controller.js";

const router = express.Router();

router.use(authenticateV2);

router.get('/getAllDiscountCode', DiscountController.getAllDiscountCode)
router.get('/getDiscountAmount', DiscountController.getDiscountAmount)
router.get('/getAllDiscountCodeWithProduct', DiscountController.getAllDiscountCodeWithProduct)


router.post('', DiscountController.createDiscountCode);
router.delete('/delete', DiscountController.deleteDiscount);
router.put('/cancel', DiscountController.cancelDiscount);
export default router