import AuthenticationService from "../authentication/AuthenticationService";
import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

class ProductService{
        
    getProductById = async (id) =>{
        let error = "";
        if(Number.isNaN(Number(id))){
            error += "Enter a Number";
            console.error('Invalid product ID:', id);
            throw error;
        }
        try{
            const response = await axios.get(`${config.VITE_BACKEND_API}/products/${Number(id)}`)
            return response.data;
        }
        catch(err){
            console.error('Failed to fetch product by ID:', id, err);
            throw err;
        }
    }

    getAllProducts = async (page) =>{
        page = Number(page);

        if(Number.isNaN(page) || page < 1) {
            console.error('Invalid page number:', page);
            throw new Error("Invalid page");
        }
        try{
            const response = await axios.get(`${config.VITE_BACKEND_API}/products?page=${page}`);
            return response.data;
        }
        catch(err){
            console.error('Failed to fetch products for page:', page, err);
            throw err;
        }
    }

    getAllProductsOfMerchant = async (page) =>{
        let error = "";
        if(page === null){
            page=1;
        }
        if(typeof page !== 'number'){
            error = "Not a valid Page";
            console.error('Invalid page type for merchant products:', typeof page);
            return error;
        }
        try{
            const response = await axios.get(`${config.VITE_BACKEND_API}/products/my_products?page=${page}`,
                {
                    headers:{
                        Authorization: `Bearer ${AuthenticationService.getToken()}`
                    }
                }
            );
            return response.data;
        }
        catch(err){
            console.error('Failed to fetch merchant products for page:', page, err);
            throw err;
        }
    }

    addProduct = async (data) =>{
        try {
            const response = await axios.post(`${config.VITE_BACKEND_API}/products/newProduct`,data, {
                headers: {
                "Content-Type": 'multipart/form-data',
                Authorization: `Bearer ${AuthenticationService.getToken()}`,
                }
            });
            return response.data;
        } catch (err) {
            console.error('Failed to add product:', err);
            throw err;
        }
    }

    deleteProduct = async (productId) => {
        try{
            const response = await axios.delete(`${config.VITE_BACKEND_API}/products/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data;
        }
        catch(err){
            console.error('Failed to delete product:', productId, err);
            throw err;
        }
    }

    updateProduct = async (id,data) =>{
        try{
            const url = `${config.VITE_BACKEND_API}/products/${id}/edit`
            const configRequest = {
                headers:{
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            }

            const response = await axios.patch(url,data,configRequest);
            return response.data;
        }
        catch(error){
            console.error("Failed to update product:", id, error);
            throw error;
        }
    }

    checkout = async (items) => {
        try{
            const response = await axios.post(`${config.VITE_BACKEND_API}/orders/checkout`, items, {
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch(err){
            console.error('Checkout failed:', err);
            throw err;
        }
    }

    searchProducts = async (query, page = 1,size = 8) => {
        try{
            const response = await axios.get(`${config.VITE_BACKEND_API}/products/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
            return response.data;
        }
        catch(err){
            console.error('Product search failed for query:', query, err);
            throw err;
        }
    }

}

export default new ProductService();