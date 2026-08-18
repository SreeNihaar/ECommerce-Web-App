import AuthenticationService from "../authentication/AuthenticationService";
import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

class MerchantAnalyticsService{

    getCategorySales = async (status) =>{
        try{
            const response = await axios.get(`${config.VITE_BACKEND_API}/merchant/my_analytics/category-sales`,{
                params:{
                    status
                },
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data;
        }
        catch(err){
            console.error('Failed to fetch category sales:', err);
            throw err;
        }
    }

    getTopProducts = async (count) =>{
        try{
            const response = await axios.get(`${config.VITE_BACKEND_API}/merchant/my_analytics/top-products`,{
                params:{
                    count
                },
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data;
        }
        catch(err){
            console.error('Failed to fetch top products analytics:', err);
            throw err;
        }
    }
};

export default new MerchantAnalyticsService();