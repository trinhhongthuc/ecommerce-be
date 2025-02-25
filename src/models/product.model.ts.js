'use strict'

import {model, Schema} from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = 'product';
const COLLECTION_NAME = 'products';

const ProductSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
    },
    product_slug: {
        type: String,
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: []
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'shop'
    },

    product_rating_average: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});
// Create index for search
ProductSchema.index({
    product_name: 'text',
    product_description: 'text'
})

// Defined document middleware:
ProductSchema.pre('save', function( next) {
    this.product_slug = slugify(this.product_name, {lower: true});

    next();
})
// Defined the product type = clothing
const clothingSchema = new Schema({
    branch: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'shop'
    },

}, {
    collection: 'clothings',
    timestamps: true
});

const electronicSchema = new Schema({
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'shop'
    },
    manufacturer: {
        type: String,
        required: true
    },
    model: String,
    color: String,
}, {
    collection: 'electronics',
    timestamps: true
});


const furnitureSchema = new Schema({
    branch: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'shop'
    },
}, {
    collection: 'furnitures',
    timestamps: true
});


const productModel = model(DOCUMENT_NAME, ProductSchema);
const clothingModel = model('clothing', clothingSchema)
const electronicModel = model('electronic', electronicSchema)
const furnitureModel = model('furniture', furnitureSchema)

export {
    productModel, clothingModel, electronicModel,
    furnitureModel
}
