import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faHourglassHalf, faBan } from "@fortawesome/free-solid-svg-icons";

function PaymentResult({ transactionId, status, onSuccess }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (status === "SUCCESS") {
            const timer = setTimeout(() => {
                onSuccess();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, onSuccess]);

    const getStatusConfig = () => {
        switch (status) {
            case "SUCCESS":
                return {
                    icon: faCheckCircle,
                    iconColor: "text-green-500",
                    bgColor: "from-green-50 to-green-100",
                    title: "Transaction Complete!",
                    message: "Your order has been placed successfully.",
                    buttonText: "Continue Shopping",
                    buttonColor: "bg-green-600 hover:bg-green-700"
                };
            case "FAILURE":
                return {
                    icon: faTimesCircle,
                    iconColor: "text-red-500",
                    bgColor: "from-red-50 to-red-100",
                    title: "Payment Failed",
                    message: "Your payment could not be processed. Please try again.",
                    buttonText: "Try Again",
                    buttonColor: "bg-red-600 hover:bg-red-700"
                };
            case "PENDING":
                return {
                    icon: faHourglassHalf,
                    iconColor: "text-yellow-500",
                    bgColor: "from-yellow-50 to-yellow-100",
                    title: "Payment Pending",
                    message: "Your payment is being processed. Please wait...",
                    buttonText: "Check Status",
                    buttonColor: "bg-yellow-600 hover:bg-yellow-700"
                };
            case "CANCELLED":
                return {
                    icon: faBan,
                    iconColor: "text-gray-500",
                    bgColor: "from-gray-50 to-gray-100",
                    title: "Payment Cancelled",
                    message: "Your payment has been cancelled.",
                    buttonText: "Go Back",
                    buttonColor: "bg-gray-600 hover:bg-gray-700"
                };
            default:
                return {
                    icon: faTimesCircle,
                    iconColor: "text-gray-500",
                    bgColor: "from-gray-50 to-gray-100",
                    title: "Unknown Status",
                    message: "Unable to determine payment status.",
                    buttonText: "Go Back",
                    buttonColor: "bg-gray-600 hover:bg-gray-700"
                };
        }
    };

    const config = getStatusConfig();

    const handleButtonClick = () => {
        if (status === "SUCCESS") {
            onSuccess();
        } else if (status === "FAILURE") {
            navigate(-1);
        } else if (status === "PENDING") {
            navigate(`/order/${transactionId}`);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className={`min-h-screen bg-linear-to-br ${config.bgColor} flex items-center justify-center p-4`}>
            <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
                <FontAwesomeIcon icon={config.icon} className={`text-5xl ${config.iconColor} mb-4`} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
                <p className="text-gray-600 mb-6">{config.message}</p>

                {transactionId && (
                    <div className="bg-gray-50 rounded p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-2">Transaction ID</p>
                        <p className="text-lg font-mono font-bold break-all">{transactionId}</p>
                    </div>
                )}

                {status === "SUCCESS" && (
                    <p className="text-sm text-gray-600 mb-6">Redirecting to orders...</p>
                )}

                <button
                    onClick={handleButtonClick}
                    className={`w-full py-3 text-white rounded-lg transition font-semibold ${config.buttonColor} cursor-pointer`}
                >
                    {config.buttonText}
                </button>
            </div>
        </div>
    );
}

export default PaymentResult;
