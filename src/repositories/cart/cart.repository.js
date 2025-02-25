import cartModel from "../../models/cart.model.js";

class CartRepository {
    static async findProductInCart(filter) {
        return cartModel.findOne(filter)
    }

    static async findUserCart(filter) {
        return  cartModel.findOne(filter);
    }

    static async createUserCart(payload) {
        const {userId, product} = payload
        const query = {
            cart_user_id: userId,
            cart_state: 'ACTIVE'
        };

        const updateOrInsert = {
            $addToSet: {
                cart_product: product
            }
        };

        const options = {
            upsert: true,
            new: true,
        }

        return cartModel.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateCard({query, upset}) {
        return cartModel.updateOne(query, upset);
    }

    static async findListUserCart(params) {
        const {userid} = params
        return cartModel.find({
            cart_user_id: userid
        }).lean();
    }

    static async findCartById(cartId) {
        return cartModel.findOne({
            _id: cartId,
            cart_state: 'ACTIVE'
        }).lean();
    }
}

export default CartRepository