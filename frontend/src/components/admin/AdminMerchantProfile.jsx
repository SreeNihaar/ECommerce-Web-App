import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MerchantService from "../../api/user/MerchantService.js";

const AdminMerchantProfile = () => {
    const id = useParams().merchantId;
    const navigate = useNavigate();

    const [merchant, setMerchant] = useState(null);
    const [error, setError] = useState("");
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        fetchMerchant();
    }, [id]);

    const fetchMerchant = async () => {
        setError("");
        MerchantService.getMerchantById(id)
            .then((res) => {
                setMerchant(res.body);
            })
            .catch((err) => {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch merchant"
                );
            })
    };

    const handleToggleApproval = async () => {
        setIsToggling(true);
        try {
            await MerchantService.toggleApprovalStatus(id);
            await fetchMerchant();
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to update merchant approval status"
            );
        } finally {
            setIsToggling(false);
        }
    };

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!merchant) {
        return null;
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-blue-600 hover:underline cursor-pointer"
            >
                ← Back to Merchants
            </button>

            <div className="bg-white border rounded-xl p-6 w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-blue-600">
                        Merchant Details
                    </h1>
                    <button
                        onClick={handleToggleApproval}
                        disabled={isToggling}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            merchant.isApproved
                                ? "bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400 cursor-pointer"
                                : "bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400 cursor-pointer"
                        } disabled:cursor-not-allowed`}
                    >
                        {isToggling
                            ? "Updating..."
                            : merchant.isApproved
                            ? "Revoke Approval"
                            : "Approve Merchant"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">ID</p>
                        <p className="text-gray-800 font-medium mt-1">{merchant.id}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Legal Business Name</p>
                        <p className="text-gray-800 font-medium mt-1">{merchant.legalBusinessName}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">GST Number</p>
                        <p className="text-gray-800 font-medium mt-1">{merchant.gstNumber}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Business Phone</p>
                        <p className="text-gray-800 font-medium mt-1">{merchant.businessPhone}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p className="text-gray-800 font-medium mt-1">{merchant.accountNumber}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="text-gray-800 font-medium mt-1">{merchant.userId}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="text-gray-800 font-medium mt-1">{merchant.userName}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Total Products</p>
                        <p className="text-gray-800 font-medium mt-1">{merchant.totalProducts}</p>
                    </div>

                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 mb-2">Status</p>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                merchant.isApproved
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {merchant.isApproved ? "Approved" : "Not Approved"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMerchantProfile;
