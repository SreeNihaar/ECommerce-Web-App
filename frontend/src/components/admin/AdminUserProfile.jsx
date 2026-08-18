import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UserService from "../../api/user/UserService.js";

const AdminUserProfile = () => {

    const id = useParams().userId;
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        setLoading(true);
        setError("");
        UserService.getUserById(id)
            .then((res)=>{
                setUser(res.body);
            })
            .catch((err)=>{
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch user"
                );
            })
            .finally(()=>setLoading(false));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-75">
                <p>Loading user...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

return (
    <div className="w-full max-w-5xl mx-auto p-6">

        <button
            onClick={() => navigate(-1)}
            className="mb-6 text-blue-600 hover:underline cursor-pointer"
        >
            ← Back to Users
        </button>

        <div className="bg-white border rounded-xl p-6 w-full">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">
                User Details
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="text-gray-800 font-medium mt-1">
                        {user.username}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="text-gray-800 font-medium mt-1">
                        {user.firstname}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="text-gray-800 font-medium mt-1">
                        {user.lastname}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-800 font-medium mt-1">
                        {user.phonenumber}
                    </p>
                </div>

                <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-800 font-medium mt-1">
                        {user.address}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-gray-800 font-medium mt-1">
                        {user.totalOrders}
                    </p>
                </div>

                <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-2">Roles</p>

                    <div className="flex flex-wrap gap-2">
                        {user.roles?.map((role) => (
                            <span
                                key={role}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                                {role}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </div>
);
};

export default AdminUserProfile;