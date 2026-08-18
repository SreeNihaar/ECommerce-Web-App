import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MerchantService from "../../api/user/MerchantService.js";
import AuthenticationService from "../../api/authentication/AuthenticationService.js";

function EditMerchantProfile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        merchantId: "",
        legalBusinessName: "",
        gstNumber: "",
        businessPhone: "",
        accountNumber: ""
    });

    useEffect(() => {

        if (!AuthenticationService.isUserLoggedIn()) {
            navigate("/login");
            return;
        }

        MerchantService.getMyProfile(AuthenticationService.getToken())
            .then((response) => {
                setProfile(response);
            })
            .catch((err) => console.error(err));

    }, []);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: name === "gstNumber" ? value.toUpperCase() : value
        }));

    };

    const handleSave = async () => {

        try {

            if (!AuthenticationService.isUserLoggedIn()) {
                navigate("/login");
                return;
            }

            await MerchantService.editProfile(
                profile,
                AuthenticationService.getToken()
            );

            alert("Merchant profile updated successfully!");

            navigate("/merchant/profile");

        } catch (err) {

            console.error(err);

            alert("Failed to update merchant profile.");

        }

    };

    return (

        <div className="min-h-screen bg-slate-100 flex justify-center py-10 px-4">

            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg">

                {/* Header */}

                <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-8">

                    <h1 className="text-3xl font-bold text-white">
                        Edit Merchant Profile
                    </h1>

                    <p className="text-blue-100 mt-2">
                        Update your business information.
                    </p>

                </div>

                {/* Form */}

                <div className="p-8 space-y-6">

                    {/* Merchant ID */}

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Merchant ID
                        </label>

                        <input
                            type="text"
                            value={profile.merchantId ?? ""}
                            disabled
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed"
                        />

                    </div>

                    {/* Legal Business Name */}

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Legal Business Name
                        </label>

                        <input
                            type="text"
                            name="legalBusinessName"
                            value={profile.legalBusinessName ?? ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* GST Number */}

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            GST Number
                        </label>

                        <input
                            type="text"
                            name="gstNumber"
                            placeholder="29ABCDE1234F1Z5"
                            value={profile.gstNumber ?? ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Business Phone */}

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business Phone
                        </label>

                        <input
                            type="tel"
                            name="businessPhone"
                            value={profile.businessPhone ?? ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Account Number */}

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Account Number
                        </label>

                        <input
                            type="text"
                            name="accountNumber"
                            inputMode="numeric"
                            value={profile.accountNumber ?? ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Buttons */}

                    <div className="flex justify-end gap-4 pt-4">

                        <button
                            onClick={() => navigate("/merchant/profile")}
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

export default EditMerchantProfile;