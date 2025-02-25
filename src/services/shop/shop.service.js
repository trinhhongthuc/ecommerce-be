import ShopModel from "../../models/shop.model.js";

class ShopService {
    static findByEmail = async ({email, select = {email: 1, password: 1, status: 1, roles: 1}}) => {
        return await ShopModel.findOne({email}).select(select).lean()
    }

    static findById = async ({userId, select = {email: 1, password: 1, status: 1, roles: 1}}) => {
        console.log('userId::', userId)
        return await ShopModel.findOne({user: userId}).select(select).lean()
    }
}

export default ShopService