import React,{useState} from "react";
import Signup from "../api/authentication/signup.js";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () =>{

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: "",
        password: "",
        firstname: "",
        lastname: "",
        address: ""
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    const [error,setError] = useState(null);

    const passwordConfirmation = ()=>{
        if(userData.password !== confirmPassword){
            setError("Passwords do not match");
            return false;
        } else {
            setError(null);
            return true;
        }
    }

    const checkEmptyFields = () =>{
        for (const key in userData){
            if(userData[key].trim() === ""){
                setError("Please fill in all fields");
                return false;
            }
        }
        setError(null);
        return true;
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        if(passwordConfirmation() && checkEmptyFields()){
            const response = await Signup(userData);
            if(response.status === 409 ){
                setError("Username already exists. Please choose a different username.");
            }
            else if(response.status === 201){
                setError(null);
                navigate("/",{replace: true});
            }
            else{
                setError("Signup failed. Please try again later.");
            }
        }
    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
            {error &&
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-5">
                    {error}
                </div>
            }
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
                Create Account
            </h2>
            <div className="user_details flex flex-col gap-5">
                <div>
                    <label htmlFor="username" className="font-medium text-slate-700">Username:</label>
                    <input type="text" name="username" id="username" placeholder="Username"
                    className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onChange={(e) => setUserData({...userData, username: e.target.value})} />
                </div>

                <div >
                    <label htmlFor="password" className="font-medium text-slate-700">Password:</label>
                    <input type="password" name="password" id="password" placeholder="Password"
                    className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onChange={(e) => setUserData({...userData, password: e.target.value})} />
                </div>
               
                <div >
                    <label htmlFor="confirmPassword" className="font-medium text-slate-700">Confirm Password:</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password"
                    className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <div >
                    <label htmlFor="firstname" className="font-medium text-slate-700">First Name:</label>
                    <input type="text" name="firstname" id="firstname" placeholder="First Name"
                    className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onChange={(e) => setUserData({...userData, firstname: e.target.value})} />
                </div>
               
                <div >
                    <label htmlFor="lastname" className="font-medium text-slate-700">Last Name:</label>
                    <input type="text" name="lastname" id="lastname" placeholder="Last Name"
                    className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onChange={(e) => setUserData({...userData, lastname: e.target.value})} />
                </div>

                <div >
                    <label htmlFor="address" className="font-medium text-slate-700">Address:</label>
                    <input type="text" name="address" id="address" placeholder="Address"
                    className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onChange={(e) => setUserData({...userData, address: e.target.value})} />
                </div>

            </div>
            <div className="signup_btn mt-8">
                <button
                    type="button"
                    onClick={handleSignUp}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                    Sign Up
                </button>
            </div>
           
            <div className="text">
                <h2 className="text-center text-slate-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800">
                        Log In
                    </Link>
                </h2>
            </div>
        </div>
        </div>
    );
}

export default SignUp;