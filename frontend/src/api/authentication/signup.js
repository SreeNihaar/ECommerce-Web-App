import AuthenticationService from "./AuthenticationService";
import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

const Signup = async (userData) => {
    try{
        const response = await axios.post(
            `${config.VITE_BACKEND_URL}/auth/signup`,
             userData
        );
        
        if(response.status === 201){
            const responseBody = response.data.body;
            
            AuthenticationService.setToken(responseBody.accessToken);
            AuthenticationService.setExpiration(responseBody.expiration);
            AuthenticationService.setUsername(responseBody.username);
            AuthenticationService.setUserRoles(responseBody.roles);

            console.log("Signup successful");
        }
        return response;
    } 
    catch(error){
        console.error("Signup failed:", error);
        return error;
    }
}

export default Signup;