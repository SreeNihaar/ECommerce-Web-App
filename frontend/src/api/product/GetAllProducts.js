import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

const GetAllProducts = async () =>{
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
};

export default GetAllProducts;