import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../../api/order/OrderService";
import OrderProductCard from "./OrderProductCard";

const OrderById = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await OrderService.getOrder(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details. Please try again.");
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

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

  const getTransactionStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "FAILURE":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLatestTransaction = () => {
    if (!order || !order.transactions || order.transactions.length === 0) {
      return null;
    }
    return order.transactions[order.transactions.length - 1];
  };


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Order not found</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2 cursor-pointer"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
              <p className="text-gray-500 mt-1">
                {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>
            <span
              className={`inline-block px-4 py-2 rounded-lg text-lg font-medium ${getStatusColor(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">{order.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{order.totalPrice}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Latest Transaction</h2>
              <div className="space-y-3">
                {getLatestTransaction() ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Transaction ID</p>
                      <p className="font-medium">{getLatestTransaction().transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium">₹{getLatestTransaction().amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getTransactionStatusColor(getLatestTransaction().transactionStatus)}`}>
                        {getLatestTransaction().transactionStatus}
                      </span>
                    </div>
                    {getLatestTransaction().failureReason && (
                      <div>
                        <p className="text-sm text-gray-600">Failure Reason</p>
                        <p className="font-medium text-red-600">{getLatestTransaction().failureReason}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">No transactions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {order.products && order.products.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.products.map((item) => (
                <OrderProductCard key={item.productId} item={item} />
              ))}
            </div>
          </div>
        )}

        {order.transactions && order.transactions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">All Transactions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Transaction ID</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {order.transactions.map((transaction, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{transaction.transactionId}</td>
                      <td className="px-4 py-3 text-sm font-medium">₹{transaction.amount}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${getTransactionStatusColor(transaction.transactionStatus)}`}>
                          {transaction.transactionStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{new Date(transaction.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderById;
