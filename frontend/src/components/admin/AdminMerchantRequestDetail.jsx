import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminService from "../../api/user/AdminService.js";

const AdminMerchantRequestDetail = () => {
    const { requestId } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState(null);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchRequestDetails();
    }, [requestId]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const fetchRequestDetails = async () => {
        try {
            setError("");
            const res = await AdminService.getMerchantRequestById(requestId);
            setRequest(res.body);
            setSelectedStatus(res.body.status?.toLowerCase());
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Failed to fetch request details"
            );
        }
    };

    const handleStatusUpdate = async () => {
        if (selectedStatus === request.status.toLowerCase()) {
            setError("Please select a different status");
            return;
        }

        try {
            setError("");
            setUpdating(true);
            await AdminService.updateMerchantRequestStatus(requestId, {
                status: selectedStatus,
            });
            setSuccessMessage("Status updated successfully!");
            await fetchRequestDetails();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString() +
            " " +
            new Date(date).toLocaleTimeString();
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            case "under_review":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };


    if (error && !request) {
        return (
            <div className="p-6">
                <div className="bg-red-100 text-red-600 p-4 rounded-lg">{error}</div>
                <button
                    onClick={() => navigate("/admin/merchant-requests")}
                    className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
                >
                    Back to Requests
                </button>
            </div>
        );
    }

    if (!request) return null;

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate("/admin/merchant-requests")}
                    className="mb-6 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                    ← Back to Requests
                </button>

                {error && (
                    <div className="mb-4 bg-red-100 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 bg-green-100 text-green-600 p-4 rounded-lg">
                        {successMessage}
                    </div>
                )}

                <div className="bg-white border rounded-xl shadow-sm p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Merchant Request #{request.requestId}
                        </h1>
                        <div className="flex items-center gap-4">
                            <span
                                className={`px-4 py-2 rounded-full font-semibold border ${getStatusColor(
                                    request.status
                                )}`}
                            >
                                {request.status}
                            </span>
                        </div>
                    </div>

                    <hr className="my-6" />

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="text-sm font-semibold text-gray-600">
                                Request ID
                            </label>
                            <p className="text-lg text-gray-800">{request.requestId}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Username</label>
                            <p className="text-lg text-gray-800">{request.username}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Legal Business Name</label>
                            <p className="text-lg text-gray-800">{request.legalBusinessName}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">GST Number</label>
                            <p className="text-lg text-gray-800">{request.gstNumber}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Contact Number</label>
                            <p className="text-lg text-gray-800">{request.contactNumber}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Status</label>
                            <p className="text-lg text-gray-800">{request.status}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="text-sm font-semibold text-gray-600">Description</label>
                        <p className="text-gray-800 mt-2 p-4 bg-gray-50 rounded-lg">{request.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Created At</label>
                            <p className="text-lg text-gray-800">{formatDate(request.createdAt)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Last Updated</label>
                            <p className="text-lg text-gray-800">{formatDate(request.updatedAt)}</p>
                        </div>
                    </div>

                    <hr className="my-6" />

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Update Request Status</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-600 mb-2">New Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                disabled={updating}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 cursor-pointer"
                            >
                                <option value="pending">Pending</option>
                                <option value="under_review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <button
                            onClick={handleStatusUpdate}
                            disabled={updating || selectedStatus === request.status.toLowerCase()}
                            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            {updating ? "Updating..." : "Update Status"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMerchantRequestDetail;
