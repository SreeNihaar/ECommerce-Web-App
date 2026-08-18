import AuthenticationService from "../authentication/AuthenticationService";
import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

class AdminService{

    getAllMerchantRequests = async (page,size) =>{
        try {
            const response = await axios.get(`${config.VITE_BACKEND_API}/merchant_requests`,{
                params:{
                    page,
                    size
                },
                headers:{
                    Authorization : `Bearer ${AuthenticationService.getToken()}`
                }
            });

            return response.data;
        } catch (err) {
            console.error('Failed to fetch merchant requests:', err);
            throw err;
        }
    }

    getMerchantRequestById = async (id) =>{
        if(Number.isNaN(Number(id))){
            console.error('Invalid merchant request ID:', id);
            throw Error("Please Valid Id");
        }
        try {
            const response = await axios.get(`${config.VITE_BACKEND_API}/merchant_requests/${id}`,{
                headers:{
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });

            return response.data;
        } catch (err) {
            console.error('Failed to fetch merchant request by ID:', id, err);
            throw err;
        }
    }

    updateMerchantRequestStatus = async (id,data) =>{
        if(Number.isNaN(Number(id))){
            console.error('Invalid merchant request ID for update:', id);
            throw Error("Please Valid Id");
        }
        try {
            const response = await axios.patch(`${config.VITE_BACKEND_API}/merchant_requests/${id}`,data,{
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });

            return response.data;
        } catch (err) {
            console.error('Failed to update merchant request status:', id, err);
            throw err;
        }
    }
}

export default new AdminService();