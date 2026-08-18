import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "../../api/order/OrderService.js";
import PaymentResult from "./PaymentResult.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

function Payment({ orderId, amount, onSuccess }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);
    const [inputAmount, setInputAmount] = useState(amount);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
    });
    const [errors, setErrors] = useState({});

    const validateCardNumber = (number) => {
        const digits = number.replace(/\D/g, "");
        return digits.length === 16;
    };

    const validateCVV = (cvv) => {
        return /^\d{3,4}$/.test(cvv);
    };

    const validateExpiryDate = (date) => {
        return /^\d{2}\/\d{2}$/.test(date);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "cardNumber") {
            formattedValue = value.replace(/\D/g, "").slice(0, 16);
            formattedValue = formattedValue.replace(/(\d{4})/g, "$1 ").trim();
        } else if (name === "expiryDate") {
            formattedValue = value.replace(/\D/g, "").slice(0, 4);
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
            }
        } else if (name === "cvv") {
            formattedValue = value.replace(/\D/g, "").slice(0, 4);
        }

        setCardDetails(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!cardDetails.cardNumber) {
            newErrors.cardNumber = "Card number is required";
        } else if (!validateCardNumber(cardDetails.cardNumber)) {
            newErrors.cardNumber = "Card number must be 16 digits";
        }

        if (!cardDetails.cardHolder) {
            newErrors.cardHolder = "Card holder name is required";
        }

        if (!cardDetails.expiryDate) {
            newErrors.expiryDate = "Expiry date is required";
        } else if (!validateExpiryDate(cardDetails.expiryDate)) {
            newErrors.expiryDate = "Format should be MM/YY";
        }

        if (!cardDetails.cvv) {
            newErrors.cvv = "CVV is required";
        } else if (!validateCVV(cardDetails.cvv)) {
            newErrors.cvv = "CVV must be 3-4 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await OrderService.processPayment(orderId, inputAmount);
            if (response && response.body) {
                const { transactionId, status } = response.body;
                setPaymentResult({
                    transactionId,
                    status
                });
            }
        } catch (err) {
            console.error("Payment error:", err);
            setPaymentResult({
                transactionId: null,
                status: "FAILURE"
            });
        } finally {
            setLoading(false);
        }
    };

    if (paymentResult) {
        return (
            <PaymentResult
                transactionId={paymentResult.transactionId}
                status={paymentResult.status}
                onSuccess={onSuccess}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900 transition cursor-pointer"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
                </button>

                <div className="bg-white rounded-lg shadow p-8">
                    <h1 className="text-2xl font-bold mb-2">Payment Details</h1>
                    <p className="text-gray-600 mb-8">Order ID: {orderId}</p>

                    <div className="mb-8 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                        <div className="flex gap-3 mb-3">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-yellow-600 shrink-0 mt-0.5" />
                            <h3 className="text-lg font-bold text-yellow-800">⚠️ DEMO PAYMENT</h3>
                        </div>
                        <p className="text-yellow-800 mb-2 font-semibold">This is a demonstration checkout and does not process real payments.</p>
                        <p className="text-yellow-700 mb-3">
                            <span className="font-semibold">Never enter your real card number, CVV, or other financial information.</span> Use the test card details shown below.
                        </p>
                    </div>

                    <form onSubmit={handlePayment}>
                        <div className="mb-6 p-4 bg-gray-50 rounded">
                            <p className="text-gray-600 text-sm">Original Amount</p>
                            <p className="text-3xl font-bold text-red-600">₹ {amount.toFixed(2)}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">Enter Amount to Pay</label>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-700">₹</span>
                                <input
                                    type="number"
                                    value={inputAmount}
                                    onChange={(e) => setInputAmount(parseFloat(e.target.value) || 0)}
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-semibold"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">Card Holder Name</label>
                            <input
                                type="text"
                                name="cardHolder"
                                value={cardDetails.cardHolder}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                    errors.cardHolder ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.cardHolder && <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={cardDetails.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                        errors.expiryDate ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={cardDetails.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                        errors.cvv ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                                {errors.submit}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 font-semibold cursor-pointer"
                        >
                            {loading ? "Processing Payment..." : `Pay ₹ ${inputAmount.toFixed(2)}`}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            This is a demo payment. Use any test card number.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Payment;
