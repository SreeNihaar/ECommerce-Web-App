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
            console.log("Login successful");
            const responseBody = response.data.body;
            AuthenticationService.setupToken(responseBody.accessToken);
        }
        return response;
    }
    catch(err){
        return err;
    }
}

export default Login;