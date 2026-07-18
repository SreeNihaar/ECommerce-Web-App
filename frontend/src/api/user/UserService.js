import axios from "axios";
import AuthenticationService from "../authentication/AuthenticationService";

const config = import.meta.env;

class UserService {
    async getMyProfile (token){
        try{
            const response = await axios.get(`${config.VITE_BACKEND_URL}/users/myprofile`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const responseBody = response.data.body;

            AuthenticationService.setUsername(responseBody.username);
            AuthenticationService.setUserRoles(responseBody.roles);

            console.log(responseBody);

            return responseBody;
        }
        catch(error){
            if (error.response?.status === 401) {
                AuthenticationService.logout();
            }

            throw error;
        }
    }
}

export default new UserService();