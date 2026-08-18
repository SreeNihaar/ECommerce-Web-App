import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFilter,
    faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";

import OrderService from "../../api/order/OrderService.js";
import OrderCard from "./OrderCard.jsx";
import OrderFilterDrawer from "./OrderFilterDrawer.jsx";

// Need to look into it.
const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        status: "",
        paymentStatus: "",
        minAmount: "",
        maxAmount: ""
    });

    const [sortBy, setSortBy] = useState("NEWEST");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        OrderService.getMyOrders().then((res)=>{
            setOrders(res);
        })
        .catch((error)=>{
            console.error("Failed to Fetch the Orders.");
        })
    };

    const filteredOrders = useMemo(() => {

        let result = [...orders];

        if (search.trim() !== "") {
            result = result.filter(order =>
                order.orderId.toString().includes(search) ||
                order.latestTransactionId?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filters.status) {
            result = result.filter(order => order.orderStatus === filters.status);
        }

        if (filters.paymentStatus) {
            const latestTx = result.map(order => {
                const lastTx = order.transactions?.[order.transactions.length - 1];
                return { ...order, lastTxStatus: lastTx?.transactionStatus };
            });
            result = latestTx.filter(order => order.lastTxStatus === filters.paymentStatus);
        }

        if (filters.minAmount) {
            result = result.filter(order => order.totalPrice >= parseFloat(filters.minAmount));
        }

        if (filters.maxAmount) {
            result = result.filter(order => order.totalPrice <= parseFloat(filters.maxAmount));
        }

        if (filters.fromDate) {
            const fromDate = new Date(filters.fromDate);
            result = result.filter(order => new Date(order.orderDate) >= fromDate);
        }

        if (filters.toDate) {
            const toDate = new Date(filters.toDate);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter(order => new Date(order.orderDate) <= toDate);
        }

        switch (sortBy) {

            case "OLDEST":
                result.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
                break;

            case "HIGH":
                result.sort((a, b) => b.totalPrice - a.totalPrice);
                break;

            case "LOW":
                result.sort((a, b) => a.totalPrice - b.totalPrice);
                break;

            default:
                result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        }

        return result;

    }, [orders, search, sortBy, filters]);

    if(orders.length === 0){
        return (
            <div className="max-w-6xl mx-auto py-10 px-4">
                <h1 className="text-3xl text-blue-700 font-bold mb-12">
                    My Orders
                </h1>
                <div className="flex items-center justify-center min-h-96 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                        <p className="text-xl text-gray-600 font-medium">
                            No Orders yet.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Start shopping to see your orders here
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (

        <div className="max-w-6xl mx-auto py-10 px-4">

            <h1 className="text-3xl font-bold">
                My Orders
            </h1>

            {/* Toolbar */}

            <div className="flex flex-wrap gap-4 mt-6">

                {/* Search */}

                <div className="flex flex-1 items-center border rounded-lg px-4">

                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-gray-500"
                    />

                    <input
                        type="text"
                        placeholder="Search Order ID / Transaction ID"
                        className="flex-1 p-3 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                {/* Filter */}

                <button
                    onClick={() => setShowFilters(true)}
                    className="px-5 rounded-lg border bg-gray-100 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                >

                    <FontAwesomeIcon icon={faFilter} />

                    Filters

                </button>

                {/* Sort */}

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg px-4 cursor-pointer"
                >

                    <option value="NEWEST">Newest First</option>
                    <option value="OLDEST">Oldest First</option>
                    <option value="HIGH">Highest Amount</option>
                    <option value="LOW">Lowest Amount</option>

                </select>

            </div>

            {/* Applied Filters */}

            <div className="flex flex-wrap gap-2 mt-5">

                {filters.status &&
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {filters.status}
                    </span>
                }

                {filters.paymentStatus &&
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {filters.paymentStatus}
                    </span>
                }

                {(filters.minAmount || filters.maxAmount) &&
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        ₹{filters.minAmount || 0} - ₹{filters.maxAmount || "∞"}
                    </span>
                }

            </div>

            {/* Orders */}

            <div className="space-y-5 mt-6">

                {filteredOrders.map(order => (

                    <OrderCard
                        key={order.orderId}
                        order={order}
                    />

                ))}

            </div>

            <OrderFilterDrawer

                open={showFilters}

                onClose={() => setShowFilters(false)}

                filters={filters}

                setFilters={setFilters}

                onApply={() => {
                    fetchOrders();
                    setShowFilters(false);
                }}

            />

        </div>

    );

};

export default Orders;