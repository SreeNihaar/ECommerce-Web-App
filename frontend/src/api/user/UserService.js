import axios from "../../api/customAxiosConfig/CustomAxiosConfig.js";
import AuthenticationService from "../authentication/AuthenticationService";

const config = import.meta.env;

class UserService {
    async getMyProfile (token){
        try{
            const response = await axios.get(`${config.VITE_BACKEND_API}/users/myprofile`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const responseBody = response.data.body;

            AuthenticationService.setUsername(responseBody.username);
            AuthenticationService.setUserRoles(responseBody.roles);

            return responseBody;
        }
        catch(error){
            console.error('Failed to fetch user profile:', error);
            if (error.response?.status === 401) {
                console.warn('Profile fetch failed with 401 - logging out');
                AuthenticationService.logout();
            }

            throw error;
        }
    }

    async editProfile(data,token){
        try{

            const url = `${config.VITE_BACKEND_API}/users/myprofile/edit`
            const configRequest = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }

            const response = await axios.patch(url,data,configRequest);
            return response.data;
        }
        catch(error){
            console.error("Failed to edit profile:", error);
            throw error;
        }
    }



    getAllUsers = async (page,size) =>{
        try {
            const response = await axios.get(`${config.VITE_BACKEND_API}/admin/users`,{
                params: {
                    page,
                    size
                },
                headers: {
                    Authorization : `Bearer ${AuthenticationService.getToken()}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Failed to fetch all users:', error);
            throw error;
        }
    }

    getUserById = async (id) =>{
        if(Number.isNaN(Number(id))){
            console.error('Invalid user ID:', id);
            throw Error("Enter Valid Id");
        }
        try {
            const response = await axios.get(`${config.VITE_BACKEND_API}/admin/users/${id}`,{
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Failed to fetch user by ID:', id, error);
            throw error;
        }
    }

    postMerchantRequest = async (data) =>{
        try {
            const response = await axios.post(`${config.VITE_BACKEND_API}/merchant_requests/new_merchant_request`, data, {
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data.body;
        } catch (error) {
            console.error('Failed to post merchant request:', error);
            throw error;
        }
    }

    getMyMerchantRequests = async () =>{
        try {
            const response = await axios.get(`${config.VITE_BACKEND_API}/merchant_requests/my_requests`, {
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data.body;
        } catch (error) {
            console.error('Failed to fetch merchant requests:', error);
            throw error;
        }
    }

    getMerchantRequestById = async (requestId) =>{
        try {
            const response = await axios.get(`${config.VITE_BACKEND_API}/merchant_requests/my_requests/${requestId}`, {
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data.body;
        } catch (error) {
            console.error('Failed to fetch merchant request by ID:', requestId, error);
            throw error;
        }
    }
}

export default new UserService();