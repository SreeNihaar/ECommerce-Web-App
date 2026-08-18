import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/CheckoutContext.jsx";
import ProductService from "../../api/product/ProductService.js";
import Payment from "./Payment.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

function CheckoutCart() {
    const navigate = useNavigate();
    const { checkoutMap, updateCheckoutItem, clearCheckout } = useData();
    const [products, setProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showPayment, setShowPayment] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const config = import.meta.env;

    useEffect(() => {
        const productIds = Object.keys(checkoutMap);
        if (productIds.length === 0) {
            setProducts([]);
            setTotalAmount(0);
            return;
        }

        const fetchProducts = async () => {
            try {
                const productsData = await Promise.all(
                    productIds.map(id => ProductService.getProductById(id))
                );
                const extractedProducts = productsData
                    .filter(p => p != null)
                    .map(p => p.body || p);
                setProducts(extractedProducts);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, [checkoutMap]);

    useEffect(() => {
        let total = 0;
        products.forEach(product => {
            const quantity = checkoutMap[product.id]?.count || 0;
            total += product.price * quantity;
        });
        setTotalAmount(total);
    }, [products, checkoutMap]);

    const handleRemoveItem = (productId) => {
        updateCheckoutItem({ id: productId }, 0);
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const checkoutItems = Object.entries(checkoutMap).map(([productId, data]) => ({
                productId: parseInt(productId),
                quantity: data.count
            }));

            const response = await ProductService.checkout(checkoutItems);

            if (response && response.body) {
                setOrderId(response.body);
                setShowPayment(true);
            }
        } catch (err) {
            console.error("Checkout error:", err);
            alert("Failed to create order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        clearCheckout();
        setShowPayment(false);
        setOrderId(null);
        navigate("/orders");
    };

    if (showPayment && orderId) {
        return <Payment orderId={orderId} amount={totalAmount} onSuccess={handlePaymentSuccess} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900 transition cursor-pointer"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
                </button>

                <h1 className="text-3xl font-bold mb-8 text-gray-900">Shopping Cart</h1>

                {products.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-600 text-lg mb-6">Your Checkout is empty</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="px-6 py-3 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow">
                                {products.map(product => {
                                    const quantity = checkoutMap[product.id]?.count || 0;
                                    const imageUrl = `https://${config.VITE_S3_BUCKET}.s3.${config.VITE_AWS_REGION}.amazonaws.com/${product.imageKey}`;

                                    return (
                                        <div key={product.id} className="p-6 border-b last:border-b-0 flex gap-4">
                                            <img
                                                src={imageUrl}
                                                alt={product.productName}
                                                className="w-24 h-24 object-contain rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold mb-2">{product.productName}</h3>
                                                <p className="text-gray-600 mb-2">{product.category}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl font-bold">₹ {product.price}</span>
                                                        <span className="text-gray-600">x {quantity}</span>
                                                    </div>
                                                    <span className="text-lg font-semibold">
                                                        ₹ {product.price * quantity}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <button
                                                        onClick={() => updateCheckoutItem(product, Math.max(0, quantity - 1))}
                                                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-semibold">{quantity}</span>
                                                    <button
                                                        onClick={() => {
                                                            if (quantity < 9 && quantity < product.stock) {
                                                                updateCheckoutItem(product, quantity + 1);
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveItem(product.id)}
                                                        className="ml-auto px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6 pb-6 border-b">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">₹ {totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-semibold">Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-semibold">₹ 0</span>
                                    </div>
                                </div>

                                <div className="flex justify-between mb-6 text-lg">
                                    <span className="font-bold">Total</span>
                                    <span className="font-bold text-red-600">₹ {totalAmount.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 font-semibold cursor-pointer"
                                >
                                    {loading ? "Processing..." : "Proceed to Payment"}
                                </button>

                                <button
                                    onClick={() => navigate("/products")}
                                    className="w-full mt-3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold cursor-pointer"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CheckoutCart;
