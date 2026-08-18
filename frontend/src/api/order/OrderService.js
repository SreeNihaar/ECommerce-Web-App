import axios from "../customAxiosConfig/CustomAxiosConfig";
import AuthenticationService from "../authentication/AuthenticationService";

const config = import.meta.env;

const API = `${config.VITE_BACKEND_API}/orders`;

class OrderService{

    async getMyOrders(){
        try{
            const response = await axios.get(API,{
                headers:{
                    Authorization:
                    `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data.body;
        }
        catch(err){
            console.error('Failed to fetch orders:', err);
            throw err.response;
        }
    }

    async getOrder(orderId){
        try{
            const response = await axios.get(`${API}/${orderId}`,{
                headers:{
                    Authorization:
                    `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data.body;
        }
        catch(err){
            console.error('Failed to fetch order:', orderId, err);
            throw err.response;
        }
    }

    async checkout(items){
        try{
            const response = await axios.post(`${API}/checkout`, items, {
                headers:{
                    Authorization:
                    `Bearer ${AuthenticationService.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch(err){
            console.error('Checkout API call failed:', err);
            throw err.response;
        }
    }

    async processPayment(orderId, amount){
        try{
            const response = await axios.post(`${API}/payment`,
                {
                    orderId: orderId,
                    amount: amount
                },
                {
                    headers:{
                        Authorization:
                        `Bearer ${AuthenticationService.getToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        }
        catch(err){
            console.error('Payment processing failed for order:', orderId, err);
            throw err.response;
        }
    }

}

export default new OrderService();
