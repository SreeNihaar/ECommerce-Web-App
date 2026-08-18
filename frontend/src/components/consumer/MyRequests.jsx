import { useEffect, useState } from "react";
import AuthenticationService from "../../api/authentication/AuthenticationService";
import UserService from "../../api/user/UserService.js";
import { useNavigate, Link } from "react-router-dom";

const MyRequests = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        username: AuthenticationService.getUsername(),
        legalBusinessName: "",
        gstNumber: "",
        contactNumber: "",
        description: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!AuthenticationService.isUserLoggedIn()) {
            navigate("/login");
        }
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            setLoading(true);
            const data = await UserService.getMyMerchantRequests();
            setRequests(data.content);
        } catch (err) {
            setError("Failed to fetch requests");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!formData.legalBusinessName || !formData.gstNumber || !formData.contactNumber) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            setSubmitting(true);
            await UserService.postMerchantRequest(formData);
            setSuccessMessage("Request submitted successfully!");
            setFormData({
                username: AuthenticationService.getUsername(),
                legalBusinessName: "",
                gstNumber: "",
                contactNumber: "",
                description: ""
            });
            setShowForm(false);
            fetchMyRequests();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit request");
            console.error("Failed to Submit Request");
        } finally {
            setSubmitting(false);
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

    return (
        <div className="max-w-7xl mx-auto p-8">
        <div className="w-full bg-white">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                <h1 className="text-4xl font-bold mb-2">My Requests</h1>
                <p className="text-blue-100">Manage your merchant access requests</p>
            </div>

            <div className="px-6 py-8">

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-300">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition shadow-md cursor-pointer"
                    >
                        {showForm ? "Cancel" : "New Request"}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-slate-50 rounded-lg p-6 mb-6 border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Submit Merchant Request</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Legal Business Name *
                                </label>
                                <input
                                    type="text"
                                    name="legalBusinessName"
                                    value={formData.legalBusinessName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    placeholder="Enter your business name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    GST Number *
                                </label>
                                <input
                                    type="text"
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    placeholder="Enter GST number"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Contact Number *
                                </label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    placeholder="Enter contact number"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    placeholder="Tell us about your business"
                                    rows="4"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
                            >
                                {submitting ? "Submitting..." : "Submit Request"}
                            </button>

                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="text-cente
                    r py-12 text-slate-600">
                        <p className="text-lg">Loading requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                        <p className="text-slate-600 text-lg">No requests yet. Submit your first merchant request!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <div key={request.requestId} className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/myrequests/${request.requestId}`)}>

                                <div className="flex justify-between items-start mb-4 gap-4">
                                    <h3 className="text-lg font-bold text-slate-800 grow">
                                        {request.legalBusinessName}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(request.status)}`}>
                                        {request.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">

                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Request Id</p>
                                        <p className="font-medium text-slate-800 mt-1">{request.requestId}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">GST Number</p>
                                        <p className="font-medium text-slate-800 mt-1">{request.gstNumber}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Contact</p>
                                        <p className="font-medium text-slate-800 mt-1">{request.contactNumber}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Submitted</p>
                                        <p className="font-medium text-slate-800 mt-1">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>


                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
        </div>
    );
};

export default MyRequests;
