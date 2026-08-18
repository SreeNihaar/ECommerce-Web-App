import AuthenticationService from "../authentication/AuthenticationService";
import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

class AdminAnalyticsService{
    getRevenue = async (month,year) =>{
        try {
            const response = await axios.get(`${config.VITE_BACKEND_API}/admin/analytics/revenue`,{
                params: {
                    month,
                    year
                },
                headers:{
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data;
        } catch (err) {
            console.error('Failed to fetch revenue analytics:', err);
            throw err;
        }
    }

    getTopMerchants = async (count) => {
        try {
            const response = await axios.get(`${config.VITE_BACKEND_API}/admin/analytics/top_merchants`,{
                params:{
                    count
                },
                headers:{
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data;
        } catch (err) {
            console.error('Failed to fetch top merchants analytics:', err);
            throw err;
        }
    }
}

export default new AdminAnalyticsService();