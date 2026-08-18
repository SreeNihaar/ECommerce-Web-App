import AuthenticationService from "./AuthenticationService";
import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

const Signup = async (userData) => {
    try{
        const response = await axios.post(
            `${config.VITE_BACKEND_API}/auth/signup`,
             userData
        );
        
        if(response.status === 201){
            const responseBody = response.data.body;
            
            AuthenticationService.setToken(responseBody.accessToken);
            AuthenticationService.setExpiration(responseBody.expiration);
            AuthenticationService.setUsername(responseBody.username);
            AuthenticationService.setUserRoles(responseBody.roles);

        }
        return response;
    }
    catch(error){
        console.error("Signup failed:", error);
        return error.response || { status: 500, data: { message: "Network error" } };
    }
}

export default Signup;