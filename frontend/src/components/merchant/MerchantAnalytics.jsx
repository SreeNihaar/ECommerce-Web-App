import { useEffect, useState } from "react";

import CategorySales from "./CategorySales.jsx";
import TopProduct from "./TopProducts.jsx";
import MerchantAnalyticsService from "../../api/analytics/MerchantAnalyticsService.js";

const MerchantAnalytics = () => {
    const [categorySales, setCategorySales] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    const [status, setStatus] = useState("DELIVERED");
    const [count, setCount] = useState(10);

    const [loadingCategory, setLoadingCategory] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [error, setError] = useState("");

    const fetchCategorySales = async () => {

        setLoadingCategory(true);
        setError("");

        MerchantAnalyticsService.getCategorySales(status)
            .then((res)=>{
                setCategorySales(res.body);
            })
            .catch((err)=>{
                console.error("Error fetching sales: ",error);
                setError("Failed to fetch category Sales");
            })
            .finally(()=>setLoadingCategory(false))

        setCategorySales(data);
    };

    const fetchTopProducts = async () => {

        setLoadingProducts(true);
        setError("");
        MerchantAnalyticsService.getTopProducts(count)
            .then((res)=>{
                setTopProducts(res.body);
            })
            .catch((err)=>{
                setError("Failed to fetch top products");
                console.error("Error fetching top products:",err)
            })
            .finally(()=>setLoadingProducts(false));

        setTopProducts(data);
    };

    useEffect(() => {
        fetchCategorySales();
    }, [status]);

    useEffect(() => {
        fetchTopProducts();
    }, [count]);


    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">

             <div className="mb-8">
                <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Sales Analytics
                </h1>
                <p className="text-indigo-600 mt-2 font-medium">
                    Track your sales performance and top selling products
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-800 font-medium shadow-md">
                    {error}
                </div>
            )}

            <CategorySales status={status} setStatus={setStatus} categorySales={categorySales} loadingCategory={loadingCategory} />

            <TopProduct topProducts={topProducts} loadingProducts={loadingProducts} count={count} setCount={setCount} />

        </div>
    );
};

export default MerchantAnalytics;