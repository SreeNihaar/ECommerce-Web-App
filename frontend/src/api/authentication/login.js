import axios from "../customAxiosConfig/CustomAxiosConfig";
import AuthenticationService from "./AuthenticationService";

const config = import.meta.env;

const Login = async (credentials) => {
    try{
        const response = await axios.post(
            `${config.VITE_BACKEND_API}/auth/login`,
             credentials
        );
        if(response.status === 200){
            const responseBody = response.data.body;

            AuthenticationService.setToken(responseBody.accessToken);
            AuthenticationService.setExpiration(responseBody.expiration);
            AuthenticationService.setUsername(responseBody.username);
            AuthenticationService.setUserRoles(responseBody.roles);

        }
        return response;
    }
    catch(err){
        console.error("Login failed:", err);
        return err.response || { status: 500, data: { message: "Network error" } };
    }
}

export default Login;