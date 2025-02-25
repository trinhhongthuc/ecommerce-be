'use strict'

import {model, Mongoose, Schema} from "mongoose";
const DOCUMENT_NAME = 'shop'
const COLLECTION_NAME = 'shops';

const shopSchema = new Schema({
    name:{
        type: String,
        trim: true,
        maxLength: 150
    },
    email:{
        type: String,
        trim: true,
        maxLength: 150
    },
    password:{
        type: String,
        trim: true,
        maxLength: 150
    },
    status:{
        type: String,
        enum: ['active',  'inactive'],
        default: 'active'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false,
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const shopModel = model(DOCUMENT_NAME, shopSchema);

export default  shopModel;