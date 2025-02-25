'use strict'

import {model, Mongoose, Schema} from "mongoose";

const DOCUMENT_NAME = 'cart'
const COLLECTION_NAME = 'carts';

const cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        default: 'ACTIVE',
        enum: ['ACTIVE', 'FAIL', 'PENDING', 'COMPLETE']
    },
    cart_product: {
        type: Array,
        required: true,
        default: []
    },
    cart_count_product: {
        type: Number,
        default: 0
    },
    cart_user_id: {
        type: String,
        required: true,
    }
}, {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    },
    collection: COLLECTION_NAME
});

const cartModel = model(DOCUMENT_NAME, cartSchema);

export default cartModel;