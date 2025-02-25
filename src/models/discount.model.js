'use strict'

import {model, Mongoose, Schema} from "mongoose";

const DOCUMENT_NAME = 'discount'
const COLLECTION_NAME = 'discounts';

const discountSchema = new Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_description: {
        type: String
    },
    discount_type: {
        type: String, default: 'fixed_amount'
    },
    discount_value: {
        type: Number, required: true
    },
    discount_code: {
        type: String, required: true
    },
    discount_start: {
        type: Date,
        required: true
    },
    discount_end: {
        type: Date,
        required: true
    },
    discount_max_uses: {
        type: Number,
        required: true
    },
    discount_uses_count: {
        type: Number,
        required: true
    },
    discount_user_used: {
        type: Array,
        default: []
    },
    discount_max_uses_per_user: {
        type: Number, required: true
    },
    discount_min_order_value: {
        type: Number, required: true
    },
    discount_shop_id: {
        type: Schema.Types.ObjectId,
        ref: 'shop'
    },
    discount_is_active: {
        type: Boolean,
        default: true
    },
    discount_applies_to: {
        type: String,
        required: true,
        enum: ['ALL', 'SPECIFIC']
    },
    discount_product_ids: {
        type: Array,
        default: []
    },
    // discount_categories: {
    //     type: Array,
    //     required: true,
    // }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const discountModel = model(DOCUMENT_NAME, discountSchema);

export default discountModel;