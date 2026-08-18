import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../api/user/UserService";
import AuthenticationService from "../../api/authentication/AuthenticationService";

function EditProfile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        username: "",
        firstname: "",
        lastname: "",
        phonenumber: "",
        address: ""
    });

    useEffect(() => {
        if(!AuthenticationService.isUserLoggedIn()){
            navigate("/login");
        }
        UserService.getMyProfile(AuthenticationService.getToken())
            .then((response) => {
                setProfile(response);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            if(!AuthenticationService.isUserLoggedIn()){
                navigate("/login");
            }
            await UserService.editProfile(profile,AuthenticationService.getToken());

            alert("Profile updated successfully!");

            navigate("/myprofile");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center py-10 px-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg">

                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-8">
                    <h1 className="text-3xl font-bold text-white">
                        Edit Profile
                    </h1>
                    <p className="text-blue-100 mt-2">
                        Update your personal information.
                    </p>
                </div>

                <div className="p-8 space-y-6">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            value={profile.username??""}
                            disabled
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            First Name
                        </label>

                        <input
                            type="text"
                            name="firstname"
                            value={profile.firstname??""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="lastname"
                            value={profile.lastname??""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phonenumber"
                            value={profile.phonenumber??""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Address
                        </label>

                        <textarea
                            rows="4"
                            name="address"
                            value={profile.address??""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">

                        <button
                            onClick={() => navigate("/myprofile")}
                            className="px-6 py-3 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                        >
                            Save Changes
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default EditProfile;