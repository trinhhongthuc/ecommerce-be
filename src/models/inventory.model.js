import {model, Schema} from "mongoose";


const DOCUMENT_NAME = 'inventory'
const COLLECTION_NAME = 'inventories'

export const inventorySchema = new Schema({
    inventory_product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    inventory_location: {
        type: String,
        default: 'unKnow'
    },
    inventory_stock: {
        type: Number, required: true,
    },
    inventory_shop_id: {
        type: Schema.Types.ObjectId,
        ref: 'shop'
    },
    inventory_reservations: {
        type: Array, default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const inventoryModel = model(DOCUMENT_NAME, inventorySchema);

export default  inventoryModel;