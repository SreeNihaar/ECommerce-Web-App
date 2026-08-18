import AuthenticationService from "../authentication/AuthenticationService";
import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

const API  = `${config.VITE_BACKEND_API}/merchant`;

class MerchantService {

    async getMyProfile(token) {
        try{
            const response = await axios.get(`${API}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const responseBody = response.data.body;
            return responseBody;
        }
        catch(error){
            console.error('Failed to fetch merchant profile:', error);
            if(error.response?.status === 401){
                console.warn('Merchant profile fetch failed with 401 - logging out');
                AuthenticationService.logout();
            }

            throw error;
        }
    }

    async editProfile(data,token){
        try{

            const url = `${API}/profile/edit`
            const configRequest = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }

            const response = await axios.patch(url,data,configRequest);
            return response.data;
        }
        catch(error){
            console.error("Failed to edit merchant profile:", error);
            throw error;
        }
    }

    async getAllMerchants(page, size) {
        try {
            const response = await axios.get(`${config.VITE_BACKEND_API}/admin/merchants`,{
                params:{
                    page,
                    size
                },
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data;
        } catch (err) {
            console.error('Failed to fetch all merchants:', err);
            throw err;
        }
    }

    async getMerchantById(id) {
        try {
            const response = await axios.get(`${config.VITE_BACKEND_API}/admin/merchants/${id}`,{
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data;
        } catch (err) {
            console.error('Failed to fetch merchant by ID:', id, err);
            throw err;
        }
    }

    async toggleApprovalStatus(id){
        try {
            const response = await axios.patch(`${config.VITE_BACKEND_API}/admin/merchants/${id}`,{},{
                headers:{
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });

            return response.data;
        } catch (err) {
            console.error('Failed to toggle merchant approval status for ID:', id, err);
            throw err;
        }
    }

}

export default new MerchantService();