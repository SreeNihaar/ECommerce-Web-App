import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "../../api/cart/CartService";
import AuthenticationService from "../../api/authentication/AuthenticationService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

function MyCart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const [updatingItems, setUpdatingItems] = useState({});

    useEffect(() => {
        if (!AuthenticationService.isUserLoggedIn()) {
            navigate("/login");
            return;
        }

        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await cartService.getMyCart();
            if (response && response.body) {
                setCartItems(response.body);
                calculateTotal(response.body);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalAmount(total);
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItems(prev => ({ ...prev, [productId]: true }));
        try {
            await cartService.updateCartItem(productId, newQuantity);
            setCartItems(prev =>
                prev.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
            calculateTotal(
                cartItems.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        } catch (error) {
            console.error("Failed to update quantity:", error);
            alert("Failed to update quantity. Please try again.");
        } finally {
            setUpdatingItems(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleRemoveItem = async (productId) => {
        setUpdatingItems(prev => ({ ...prev, [productId]: true }));
        try {
            await cartService.removeFromCart(productId);
            setCartItems(prev => prev.filter(item => item.productId !== productId));
            const updatedItems = cartItems.filter(item => item.productId !== productId);
            calculateTotal(updatedItems);
        } catch (error) {
            console.error("Failed to remove item:", error);
            alert("Failed to remove item. Please try again.");
        } finally {
            setUpdatingItems(prev => ({ ...prev, [productId]: false }));
        }
    };

    if (!AuthenticationService.isUserLoggedIn()) {
        return null;
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

                <h1 className="text-3xl font-bold mb-8 text-gray-900">My Cart</h1>

                {loading ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-600">Loading cart...</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
                        <p className="text-gray-500 text-sm mb-6">
                            Items added to cart from product pages will appear here. Click on "Add to Cart" button on any product to add it.
                        </p>
                        <button
                            onClick={() => navigate("/products")}
                            className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow">
                                {cartItems.map((item) => (
                                    <div key={item.productId} className="p-6 border-b last:border-b-0">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-1">{item.productName}</h3>
                                                <p className="text-gray-600 text-sm">SKU: {item.productId}</p>
                                            </div>
                                            <span className="text-lg font-semibold">
                                                ₹ {(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-700 font-medium">₹ {item.price}</span>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                                        disabled={updatingItems[item.productId] || item.quantity <= 1}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                                        disabled={updatingItems[item.productId]}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.productId)}
                                                    disabled={updatingItems[item.productId]}
                                                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 font-medium cursor-pointer"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                    <span className="font-bold text-blue-600">₹ {totalAmount.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={() => navigate("/products")}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold cursor-pointer"
                                >
                                    Continue Shopping
                                </button>

                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full mt-3 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold cursor-pointer"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyCart;
