import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBuilding,
    faIdBadge,
    faPhone,
    faUniversity,
    faFileInvoice
} from "@fortawesome/free-solid-svg-icons";

import MerchantService from "../../api/user/MerchantService.js";
import AuthenticationService from "../../api/authentication/AuthenticationService.js";

const MerchantProfile = () => {

    const navigate = useNavigate();
    const [merchant, setMerchant] = useState({});

    useEffect(() => {
        if (!AuthenticationService.isUserLoggedIn() || !AuthenticationService.getUserRoles().includes("MERCHANT")) {
            navigate("/login", { replace: true });
            return;
        }

        MerchantService.getMyProfile(AuthenticationService.getToken())
            .then((res) => {
                setMerchant(res);
            })
            .catch((err) => {
                console.error("Failed to get Merchant Profile.");
            });

    }, []);

    const maskAccount = (account) => {
        if (!account) return "Not Defined";
        return "XXXX XXXX " + account.slice(-4);
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}

                <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white py-8 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl">
                        <FontAwesomeIcon icon={faBuilding} />
                    </div>
                    <h2 className="text-3xl font-bold mt-4">
                        {merchant.legalBusinessName ?? "Not Defined"}
                    </h2>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    <ProfileRow
                        icon={faIdBadge}
                        title="Merchant ID"
                        value={merchant.merchantId ?? "Not Defined"}
                    />
                    <ProfileRow
                        icon={faBuilding}
                        title="Legal Business Name"
                        value={merchant.legalBusinessName ?? "Not Defined"}
                    />
                    <ProfileRow
                        icon={faFileInvoice}
                        title="GST Number"
                        value={merchant.gstNumber ?? "Not Defined"}
                    />
                    <ProfileRow
                        icon={faPhone}
                        title="Business Phone"
                        value={merchant.businessPhone ?? "Not Defined"}
                    />
                    <ProfileRow
                        icon={faUniversity}
                        title="Bank Account"
                        value={maskAccount(merchant.accountNumber)}
                    />

                    <div className="pt-4 flex justify-end">
                        <button
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer"
                            onClick={() =>
                                navigate("/merchant/profile/edit", {
                                    replace: true,
                                })
                            }
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileRow = ({ icon, title, value }) => (

    <div className="flex items-center border-b pb-4">

        <div className="w-10 text-blue-600 text-lg">

            <FontAwesomeIcon icon={icon} />

        </div>

        <div className="flex-1">

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <p className="text-lg font-medium text-gray-800">
                {value}
            </p>

        </div>

    </div>

);

export default MerchantProfile;