import CheckoutService from "../../services/checkout/checkout.service.js";
import {OK} from "../../middlewares/success.middlewar.js"

class CheckoutController {
    static async checkout(req, res, next) {
        const metadata = await CheckoutService.checkoutReview(res.body);

        new OK({
            message: 'Get Checkout review Success',
            metadata,
        }).send(res)
    }
}

export default CheckoutController