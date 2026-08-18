import axios from "../customAxiosConfig/CustomAxiosConfig";
import AuthenticationService from "../authentication/AuthenticationService";

const config = import.meta.env;

const API = `${config.VITE_BACKEND_API}/orders`;
const MERCHANT_API = `${config.VITE_BACKEND_API}/merchant`;

class MerchantOrderService {

    async getMerchantOrders(page = 0, size = 3) {
        try {
            const response = await axios.get(`${API}/merchant/my_orders`, {
                params: {
                    page,
                    size
                },
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data.body;
        } catch (err) {
            console.error('Failed to fetch merchant orders:', err);
            throw err;
        }
    }

    async updateOrderStatus(orderId, orderStatus) {
        try {
            const response = await axios.patch(`${MERCHANT_API}/orders/update-status`, {
                orderId: orderId,
                orderStatus: orderStatus
            }, {
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (err) {
            console.error('Failed to update order status for order:', orderId, err);
            throw err;
        }
    }

}

export default new MerchantOrderService();
