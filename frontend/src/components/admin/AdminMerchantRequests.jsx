import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminService from "../../api/user/AdminService.js";
import { usePagination } from "../../context/PaginationContext.jsx";

const AdminMerchantRequests = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { totalPages, setTotalPages } = usePagination();

    const [requests, setRequests] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");

    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 8;

    useEffect(() => {
        fetchMerchantRequests();
    }, [page, size]);

    const fetchMerchantRequests = async () => {
        try {
            setError("");
            const res = await AdminService.getAllMerchantRequests(page, size);
            setRequests(res.body.content);
            setTotalPages(res.body.totalPages);
            setTotalElements(res.body.totalElements);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch merchant requests");
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
    };

    const getStatusBadgeColor = (status) => {
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

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 text-red-600 p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">
                            Merchant Requests
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Total Requests: {totalElements}
                        </p>
                    </div>
                </div>

                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Username</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Created At</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {requests.length > 0 ? (
                                    requests.map((request) => (
                                        <tr
                                            key={request.requestId}
                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm">{request.requestId}</td>
                                            <td className="px-6 py-4 text-sm">{request.username}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                                                        request.status
                                                    )}`}
                                                >
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{formatDate(request.createdAt)}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/merchant-requests/${request.requestId}`
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No merchant requests found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() =>
                                    setSearchParams({ page: p, size })
                                }
                                className={`px-3 py-2 rounded ${
                                    page === p
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMerchantRequests;
