import { useEffect, useState } from "react";
import AuthenticationService from "../../api/authentication/AuthenticationService";
import UserService from "../../api/user/UserService.js";
import { useNavigate, useParams } from "react-router-dom";

const MyRequestById = () => {
    const navigate = useNavigate();
    const { requestId } = useParams();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!AuthenticationService.isUserLoggedIn()) {
            navigate("/login");
        }
        fetchRequest();
    }, [requestId]);

    const fetchRequest = async () => {
        try {
            setLoading(true);
            const data = await UserService.getMerchantRequestById(requestId);
            setRequest(data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch request details");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-700 border border-yellow-300";
            case "APPROVED":
                return "bg-green-100 text-green-700 border border-green-300";
            case "REJECTED":
                return "bg-red-100 text-red-700 border border-red-300";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-300";
        }
    };

    if (loading) {
        return (
            <div className="w-full bg-white">
                <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                    <h1 className="text-4xl font-bold mb-2">Request Details</h1>
                </div>
                <div className="px-6 py-8 text-center">
                    <p className="text-slate-600 text-lg">Loading request details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-white">
                <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                    <h1 className="text-4xl font-bold mb-2">Request Details</h1>
                </div>
                <div className="px-6 py-8">
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
                        {error}
                    </div>
                    <button
                        onClick={() => navigate("/myrequests")}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition cursor-pointer"
                    >
                        Back to Requests
                    </button>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="w-full bg-white">
                <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                    <h1 className="text-4xl font-bold mb-2">Request Details</h1>
                </div>
                <div className="px-6 py-8 text-center">
                    <p className="text-slate-600 text-lg">Request not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Request Details</h1>
                        <p className="text-blue-100">View your merchant access request</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8">

                <button
                    onClick={() => navigate("/myrequests")}
                    className="mb-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition cursor-pointer"
                >
                    ← Back to Requests
                </button>

                <div className={`rounded-lg p-8 border-2 bg-blue-50`}>

                    <h2 className="text-3xl font-bold text-slate-800 mb-6">
                        {request.legalBusinessName}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                        <div>
                            <p className="text-sm text-slate-500 uppercase font-semibold mb-2">GST Number</p>
                            <p className="text-2xl font-bold text-slate-800">{request.gstNumber}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Contact Number</p>
                            <p className="text-2xl font-bold text-slate-800">{request.contactNumber}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Username</p>
                            <p className="text-2xl font-bold text-slate-800">{request.username}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Status</p>
                            <p className={`text-lg font-bold px-3 py-1 rounded-full w-fit ${getStatusColor(request.status)}`}>
                                {request.status}
                            </p>
                        </div>

                    </div>

                    <div className="border-t border-slate-200 pt-8 mb-8">
                        <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Request ID</p>
                        <p className="text-slate-800 font-mono text-lg">{request.requestId}</p>
                    </div>

                    {request.description && (
                        <div className="border-t border-slate-200 pt-8 mb-8">
                            <p className="text-sm text-slate-500 uppercase font-semibold mb-3">Description</p>
                            <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                                {request.description}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 pt-8">

                        <div>
                            <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Submitted Date</p>
                            <p className="text-slate-800 font-semibold">
                                {new Date(request.createdAt).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </p>
                            <p className="text-slate-600 text-sm">
                                {new Date(request.createdAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Last Updated</p>
                            <p className="text-slate-800 font-semibold">
                                {new Date(request.updatedAt).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </p>
                            <p className="text-slate-600 text-sm">
                                {new Date(request.updatedAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default MyRequestById;
