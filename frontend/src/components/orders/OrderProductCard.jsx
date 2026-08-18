const OrderProductCard = ({item})=>{
    
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
        <div className="flex items-center justify-between border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex items-center gap-4 flex-1">
                {item.imageUrl && (
                    <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"/>
                )}
                <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.productName}</h3>
                    <p className="text-xs text-gray-500">ID: {item.productId}</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <p className="text-sm text-gray-600">Qty: <span className="font-semibold">{item.quantity}</span></p>
                <p className="text-lg font-bold text-green-600 min-w-20 text-right">₹{item.priceAtPurchase}</p>
                {item.productStatus && (
                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusColor(item.productStatus)}`}>
                        {item.productStatus}
                    </span>
                )}
            </div>
        </div>
    );
}

export default OrderProductCard;