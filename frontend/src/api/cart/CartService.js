import AuthenticationService from "../authentication/AuthenticationService";
import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

class CartService {

    addProductToCart = async (productId, quantity) => {
        try {
            const response = await axios.post(
                `${config.VITE_BACKEND_API}/cart/${productId}`,
                {
                    productId: productId,
                    quantity: quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${AuthenticationService.getToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Failed to add product to cart:', productId, quantity, err);
            throw err;
        }
    }
    

    getMyCart = async () => {
        try {
            const response = await axios.get(
                `${config.VITE_BACKEND_API}/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${AuthenticationService.getToken()}`
                    }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            throw err;
        }
    }

    updateCartItem = async (productId, quantity) => {
        try {
            const response = await axios.put(
                `${config.VITE_BACKEND_API}/cart/${productId}`,
                {
                    quantity: quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${AuthenticationService.getToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Failed to update cart item:', productId, quantity, err);
            throw err;
        }
    }

    removeFromCart = async (productId) => {
        try {
            const response = await axios.delete(
                `${config.VITE_BACKEND_API}/cart/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${AuthenticationService.getToken()}`
                    }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Failed to remove product from cart:', productId, err);
            throw err;
        }
    }
}

export default new CartService();
