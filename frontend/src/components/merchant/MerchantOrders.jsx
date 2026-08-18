import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MerchantOrderService from "../../api/order/MerchantOrderService";
import { usePagination } from "../../context/PaginationContext.jsx";

const MerchantOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    
    const [searchParams, setSearchParams] = useSearchParams();
    const { setTotalPages } = usePagination();
    
    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 3;

    useEffect(() => {
        fetchOrders(page,size);
    }, [page,size]);

    const fetchOrders = async (page, size) => {
        setError("");
        try {
            const response = await MerchantOrderService.getMerchantOrders(page, size);
            if (response && response.content) {
                setOrders(response.content);
                setTotalPages(response.totalPages);
            } else {
                console.warn("Unexpected response structure:", response);
                setError("Unexpected response format from server");
            }
        } catch (err) {
            const errorMsg = err?.data?.message || err?.message || "Failed to fetch merchant orders";
            setError(errorMsg);
            console.error("Error fetching orders:", err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PAYMENT_PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "PROCESSING":
                return "bg-blue-100 text-blue-800";
            case "SHIPPED":
                return "bg-indigo-100 text-indigo-800";
            case "DELIVERED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getNextAction = (status) => {
        switch (status) {
            case "PROCESSING":
                return { label: "Mark as Shipped", nextStatus: "SHIPPED", enabled: true };
            case "SHIPPED":
                return { label: "Mark as Delivered", nextStatus: "DELIVERED", enabled: true };
            case "DELIVERED":
                return { label: "✓ Delivered", nextStatus: null, enabled: false };
            case "CANCELLED":
                return { label: "✕ Cancelled", nextStatus: null, enabled: false };
            default:
                return { label: "No Action", nextStatus: null, enabled: false };
        }
    };

    const handleStatusUpdate = async (orderId, nextStatus) => {
        setUpdatingOrderId(orderId);
        setError("");
        setSuccessMessage("");
        try {
            await MerchantOrderService.updateOrderStatus(orderId, nextStatus);
            setSuccessMessage("Order status updated successfully");

            setOrders(orders.map(order =>
                order.orderId === orderId
                    ? { ...order, orderStatus: nextStatus }
                    : order
            ));

            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError("Failed to update order status");
            console.error("Error updating status:", err);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-linear-to-r text-blue-600 bg-clip-text">Order Management</h1>
                    <p className="text-indigo-600 mt-2 font-medium">View and manage your merchant orders</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-800 font-medium shadow-md">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 rounded-lg bg-green-100 border border-green-300 px-4 py-3 text-green-800 font-medium shadow-md">
                        {successMessage}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600 text-lg">No orders yet</p>
                    </div>
                ) : (
                    <>
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const action = getNextAction(order.orderStatus);
                            return (
                                <div
                                    key={order.orderId}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-black"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    Order #{order.orderId}
                                                </h2>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Updated At: {new Date(order.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                                {action.enabled && (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                order.orderId,
                                                                action.nextStatus
                                                            )
                                                        }
                                                        disabled={updatingOrderId === order.orderId}
                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {updatingOrderId === order.orderId? "Updating...": action.label}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="font-semibold text-gray-700 mb-3">Products</h3>
                                            <div className="space-y-2">
                                                {order.products.map((product) => (
                                                    <div
                                                        key={product.productId}
                                                        className="flex justify-between items-start bg-gray-50 p-3 rounded-lg"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-800">{product.productName}</p>
                                                            <p className="text-sm text-gray-600">Quantity: {product.stock}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-800">₹{(product.priceAtPurchase *product.stock).toFixed(2)}</p>
                                                            <p className="text-sm text-gray-600">@ ₹{product.priceAtPurchase.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t pt-4 flex justify-between items-center">
                                            <span className="text-gray-700 font-semibold">Total Amount:</span>
                                            <span className="text-2xl font-bold text-indigo-600">₹{order.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    </>
                )}
        </div>
    );
};

export default MerchantOrders;
