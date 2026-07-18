import axios from "../customAxiosConfig/CustomAxiosConfig";
import AuthenticationService from "./AuthenticationService";

const config = import.meta.env;

const Login = async (credentials) => {
    try{
        const response = await axios.post(
            `${config.VITE_BACKEND_URL}/auth/login`,
             credentials
        );
        if(response.status === 200){
            const responseBody = response.data.body;

            console.log(responseBody);

            AuthenticationService.setToken(responseBody.accessToken);
            AuthenticationService.setExpiration(responseBody.expiration);
            AuthenticationService.setUsername(responseBody.username);
            AuthenticationService.setUserRoles(responseBody.roles);
            
            console.log("Login successful");
        }
        return response;
    }
    catch(err){
        return err;
    }
}

export default Login;