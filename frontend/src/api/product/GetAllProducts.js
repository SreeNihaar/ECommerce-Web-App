import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

const GetAllProducts = async () =>{
    try{
        return await axios.get(`${config.VITE_BACKEND_URL}/products`);
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