import React, {useState} from "react";
import LoginAPI from "../api/authentication/login.js";
import { Link, replace, useNavigate } from "react-router-dom";

const Login = () =>{

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
   
    const [error, setError] = useState(null);

    const handleUsernameChange =(e)=>{
        setCredentials({...credentials, username: e.target.value});
    }

    const handlePasswordChange =(e)=>{
        setCredentials({...credentials, password: e.target.value});
    }

    const handleLogin = async () => {
        const response = await LoginAPI(credentials);
        if(response.status >= 400 && response.status < 500){
            setError("Invalid username or password");
        }
        else if(response.status === 200){
            setError(null);
            navigate("/",{replace: true});
        }
        else{
            setError("Please try again later.");
        }
    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-center text-slate-800">
                Login
            </h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
            <div className="userName_div w-full">
                <label htmlFor="username" className="font-medium text-slate-700">Username: </label>
                <input type="text" name="username"
                    id="username" placeholder="Username"
                    className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onChange={handleUsernameChange} />
            </div>
            <div className="password_div w-full">
                <label htmlFor="password" className="font-medium text-slate-700">Password: </label>
                <input type="password" name="password" id="password"
                placeholder="Password"
                className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={handlePasswordChange} />
            </div>
            <div className="button_div w-full">
                <button type="button"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 cursor-pointer"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
            <div className="text">
                <h2 className="text-center text-slate-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-800">
                        Register
                    </Link>
                </h2>
            </div>
        </div>
    </div>
    );

}
export default Login;