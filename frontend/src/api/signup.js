import AuthenticationService from "./authentication/AuthenticationService";
import axios from "./customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

const Signup = async (userData) => {
    try{
        const response = await axios.post(
            `${config.VITE_BACKEND_URL}/auth/signup`,
             userData
        );
        if(response.status === 201){
            console.log(response.data);
            const responseBody = response.data.body;
            AuthenticationService.setupToken(responseBody.accessToken);
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

