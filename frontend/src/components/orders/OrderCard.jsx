import {useNavigate} from "react-router-dom";

const OrderCard = ({order})=>{

    const navigate = useNavigate();

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

    return(
        <div
            onClick={()=>navigate(`/myorders/${order.orderId}`)}
            className="bg-white border border-gray-200 shadow-sm p-4 hover:shadow-md cursor-pointer transition flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Order #{order.orderId}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {new Date(order.orderDate).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Txn:</span> {order.latestTransactionId}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Pymt Status:</span> {order.latestTransactionStatus??"Not yet"}
                </p>
            </div>

            <div className="text-right min-w-max">
                <p className="text-xl font-bold mb-2">
                    ₹{order.totalPrice}
                </p>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                </span>
            </div>
        </div>
    );

}

export default OrderCard;