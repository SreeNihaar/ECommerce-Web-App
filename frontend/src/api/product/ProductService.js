import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

class ProductService{
        
    getProductById = async (id) =>{
        let error = "";
        if(typeof id !== 'number'){
            error = "Enter a number";
            return error;
        }
        try{
            const response = await axios.get(`${config.VITE_BACKEND_URL}/products/${id}`)
            console.log(response.data);
            return response.data;
        }
        catch(err){
            error+=err.response;
            throw err;
        }
    }

    getAllProducts = async () =>{
        try{
            const response = await axios.get(`${config.VITE_BACKEND_URL}/products`);
            return response.data;
        }
        catch(err){
            let error = "";
            if(err.response){
                error+=err.response;
            }
            return error;
        }
    }

}

export default new ProductService();