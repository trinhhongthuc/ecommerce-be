'use strict'

import {model, Mongoose, Schema} from "mongoose";
const DOCUMENT_NAME = 'key'
const COLLECTION_NAME = 'keys';

const keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'shop'
    },
    publicKey: {
        type: String,
        require: true,

    },
    privateKey: {
        type: String,
        require: true,

    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const keyTokenModel = model(DOCUMENT_NAME, keyTokenSchema);

export default  keyTokenModel;