import { useEffect, useState } from "react";
import AdminRevenue from "./AdminRevenue.jsx";
import TopMerchants from "./TopMerchants.jsx";
import AdminAnalyticsService from "../../api/analytics/AdminAnalyticsService.js";

const AdminAnalytics = () => {

    const currentDate = new Date();

    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [year, setYear] = useState(currentDate.getFullYear());

    const [revenueData, setRevenueData] = useState([]);
    const [topMerchants, setTopMerchants] = useState([]);

    const [count, setCount] = useState(10);

    const [loadingRevenue, setLoadingRevenue] = useState(false);
    const [loadingMerchants, setLoadingMerchants] = useState(false);

    const [error, setError] = useState("");

    const fetchRevenue = async () => {
        try {
            setLoadingRevenue(true);
            setError("");

            const response = await AdminAnalyticsService.getRevenue(month, year);
            setRevenueData(response.body);

        } catch (error) {
            console.error("Error fetching revenue:", error);
            setError("Failed to fetch revenue analytics");

        } finally {
            setLoadingRevenue(false);
        }
    };

    const fetchTopMerchants = async () => {
        try {
            setLoadingMerchants(true);
            setError("");
            const response = await AdminAnalyticsService.getTopMerchants(count);
            setTopMerchants(response.body);

        } catch (error) {
            console.error("Error fetching top merchants:", error);
            setError("Failed to fetch top merchants");
        } finally {
            setLoadingMerchants(false);
        }
    };

    useEffect(() => {
        fetchRevenue();
    }, [month, year]);

    useEffect(() => {
        fetchTopMerchants();
    }, [count]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Admin Analytics
                </h1>
                <p className="text-gray-500 mt-1">
                    Monitor platform revenue and merchant performance
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-100 border border-red-200 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            <AdminRevenue revenueData={revenueData} loadingRevenue={loadingRevenue} month={month} setMonth={setMonth} year={year} setYear={setYear} />

            <TopMerchants topMerchants={topMerchants} loadingMerchants={loadingMerchants} count={count} setCount={setCount} />
        </div>
    );
};

export default AdminAnalytics;