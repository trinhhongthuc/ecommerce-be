import inventoryModel from "../../models/inventory.model.js";

class InventoryRepository {
    static async insertInventory({
                                     productId, shopId, stock, location = 'unKnow'
                                 }) {

        return inventoryModel.create({
            inventory_product_id: productId,
            inventory_shop_id: shopId,
            inventory_location: location,
            inventory_stock: stock,
        });
    }
}

export default InventoryRepository