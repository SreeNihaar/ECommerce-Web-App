import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MerchantService from "../../api/user/MerchantService.js";
import { usePagination } from "../../context/PaginationContext.jsx";

const AdminMerchantsDashboard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { totalPages, setTotalPages } = usePagination();

    const [merchants, setMerchants] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");

    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 8;

    useEffect(() => {
        fetchMerchants();
    }, [page, size]);

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
    };

    const fetchMerchants = async () => {
        try {
            setError("");
            MerchantService.getAllMerchants(page, size)
                .then((res) => {
                    const data = res.body.content;
                    setMerchants(data);
                    setTotalPages(res.body.totalPages);
                    setTotalElements(res.body.totalElements);
                })
                .catch((err) => {
                    console.error(err);
                    setError(
                        err.response?.data?.message ||
                        "Failed to fetch merchants"
                    );
                });
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Failed to fetch merchants"
            );
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

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">Merchants</h1>
                        <p className="text-gray-500 mt-1">Total Merchants: {totalElements}</p>
                    </div>
                </div>

                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Legal Business Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total Products</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Business Phone</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Created At</th>
                                </tr>
                            </thead>

                            <tbody>
                                {merchants.map((merchant) => (
                                    <tr
                                        key={merchant.id}
                                        className={`border-b last:border-b-0 ${(!merchant.isApproved)?'bg-red-200 hover:bg-red-300 ':'hover:bg-gray-100'} cursor-pointer`}
                                        onClick={() => navigate(`/admin/merchants/${merchant.id}`)}
                                    >
                                        <td className="px-6 py-4">{merchant.id}</td>
                                        <td className="px-6 py-4">{merchant.legalBusinessName}</td>
                                        <td className="px-6 py-4">{merchant.totalProducts || 0}</td>
                                        <td className="px-6 py-4">{merchant.businessPhone}</td>
                                        <td className="px-6 py-4">{formatDate(merchant.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMerchantsDashboard;
