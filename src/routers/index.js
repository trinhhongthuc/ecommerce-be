'use strict'

import express from "express";
import accessRouter from "./access/index.js";
import apiKeyModel from "../models/apiKey.model.js";
import app from "../app.js";
import productRouter from "./product/product.router.js";
import discountRouter from "./discount/discount.router.js";
import cartRouter from "./cart/cart.router.js";
import checkoutRouter from "./checkout/checkout.router.js";

const router = express.Router();
const BASE_URI = '/api/v1';


router.get('/apikey', async (req, res, next) => {
    const result = await apiKeyModel.create({
        key: '1',
        permissions: ['0000']
    })

    return res.status(201).json(result)
})

// Check permission
router.use(`${BASE_URI}/shop`, accessRouter);
router.use(`${BASE_URI}/product`, productRouter);
router.use(`${BASE_URI}/discount`, discountRouter);
router.use(`${BASE_URI}/cart`, cartRouter);
router.use(`${BASE_URI}/checkout`, checkoutRouter);


export default router;