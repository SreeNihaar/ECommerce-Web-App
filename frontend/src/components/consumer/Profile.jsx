import React, { useEffect, useState } from "react";
import AuthenticationService from "../../api/authentication/AuthenticationService";
import UserService from "../../api/user/UserService.js";
import { useNavigate } from "react-router-dom";

const Profile = () =>{
    const username = AuthenticationService.getUsername();
    const navigate = useNavigate();

    const [profile,setProfile] = useState({});

    useEffect(()=>{
        if(!AuthenticationService.isUserLoggedIn()){
            navigate("/login");        
        }
        UserService.getMyProfile(AuthenticationService.getToken())
            .then((res)=>{
                console.log(res);
                setProfile(res);
            })
            .catch((err)=>{
                console.log(err);
            })
    },[]);

    return <>

<div className="min-h-screen bg-slate-100 flex justify-center items-start py-10 px-4">
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold">
                    {profile.firstname?.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h1 className="text-3xl font-bold">
                        {profile.firstname} {profile.lastname}
                    </h1>
                    <p className="text-blue-100">@{profile.username}</p>
                </div>
            </div>
        </div>

        {/* Details */}
        <div className="p-8">

            <h2 className="text-xl font-semibold text-slate-700 mb-6">
                Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                    <p className="text-sm text-slate-500">Username</p>
                    <p className="font-medium text-slate-800">
                        {profile.username}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Phone Number</p>
                    <p className="font-medium text-slate-800">
                        {profile.phonenumber || "Not Provided"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">First Name</p>
                    <p className="font-medium text-slate-800">
                        {profile.firstname}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">Last Name</p>
                    <p className="font-medium text-slate-800">
                        {profile.lastname}
                    </p>
                </div>

                <div className="md:col-span-2">
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium text-slate-800">
                        {profile.address || "Not Provided"}
                    </p>
                </div>

                <div className="md:col-span-2">
                    <p className="text-sm text-slate-500 mb-2">Roles</p>

                    <div className="flex flex-wrap gap-2">
                        {profile.roles?.map((role, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
                            >
                                {role}
                            </span>
                        ))}
                    </div>
                </div>

            </div>

            <div className="mt-8 flex justify-end">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    Edit Profile
                </button>
            </div>

        </div>

    </div>
</div>

    </>;
}

export default Profile;