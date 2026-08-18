import { useEffect, useState } from "react";
import productService from "../../api/product/ProductService.js";
import cartService from "../../api/cart/CartService.js";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar,faPenToSquare,faTrash } from '@fortawesome/free-solid-svg-icons';
import { useData} from "../../context/CheckoutContext.jsx";
import AuthenticationService from "../../api/authentication/AuthenticationService.js";
import { useLocation } from "react-router-dom";
import ReviewSection from "../review/ReviewSection.jsx";

const MerchantOptions = () => {


    const productId = useParams().productId;
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/merchant/my_products/edit/${productId}`);
    };

    const handleDelete = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await productService.deleteProduct(productId);
            navigate("/merchant/my_products");
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert("Failed to delete product. Please try again.");
        }
    };

    return (
        <div className="flex gap-4 mt-6">
            <button
                onClick={handleEdit}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 transition cursor-pointer"
            >
                <FontAwesomeIcon icon={faPenToSquare} />
                Edit Product
            </button>

            <button
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-white hover:bg-red-700 transition cursor-pointer"
            >
                <FontAwesomeIcon icon={faTrash} />
                Delete Product
            </button>
        </div>
    );
};



const Product = () =>{
    const [product , setProduct] = useState({});
    const [imageUrl,setImageUrl] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const {checkoutMap,updateCheckoutItem} = useData();

    const location = useLocation();
    const isMerchant = location.pathname.includes("/my_products");
    const isLoggedIn = AuthenticationService.isUserLoggedIn();
    
    const config = import.meta.env;
    const navigate = useNavigate();

    const productId = useParams().productId;

    function isNumber(str) {
        return typeof str === "string" && /^[1-9]\d*$/.test(str);
    }

    const count = (checkoutMap[product.id]) ? checkoutMap[product.id].count : 0;


    function addCount(e) {
        e.stopPropagation();
        if(!AuthenticationService.isUserLoggedIn()){
            navigate("/login");
            return;
        }
        if (count < 9) {
            const newValue = count + 1;
            updateCheckoutItem(product, newValue);
        }
    }

    function subCount(e) {
        e.stopPropagation();
        if(!AuthenticationService.isUserLoggedIn()){
            navigate("/login");
            return;
        }
        if (count > 0) {
            const newValue = count - 1;
            updateCheckoutItem(product, newValue);
        }
    }

    const handleAddToCart = async (e) => {
        e.stopPropagation();

        if (!AuthenticationService.isUserLoggedIn()) {
            navigate("/login");
            return;
        }

        if (!product.id || product.stock <= 0) {
            return;
        }

        setIsAddingToCart(true);
        setCartMessage("");

        try {
            await cartService.addProductToCart(product.id, 1);

            setCartMessage("✓ Added to cart successfully!");

            setTimeout(() => {
                setCartMessage("");
            }, 2000);

        } catch (error) {
            console.error("Failed to add product to cart:", error);

            setCartMessage(
                error.response?.data?.message ||
                "✗ Failed to add to cart. Please try again."
            );
        } finally {
            setIsAddingToCart(false);
        }
    };
    
    
    useEffect(()=>{
        if(!isNumber(productId)){
            console.error("Error fetching product. Product Id is not Valid Number");
            return;
        }
        productService.getProductById(Number(productId))
            .then((res)=>{
                setProduct(res.body);
                const imageLink = `https://${config.VITE_S3_BUCKET}.s3.${config.VITE_AWS_REGION}.amazonaws.com/${res.body.imageKey}`;
                setImageUrl(imageLink);
            })
            .catch((err)=>{
                console.error("Error finding the product of Id: ",err);
            });
    },[]);

    
    return (
        <div className="w-full p-8">
            <button
                    onClick={() =>{
                        if(isMerchant){
                            navigate("/merchant/my_products");
                        }
                        else{
                            navigate("/products");
                        }
                    }}
                    className="mb-6 text-blue-600 hover:text-blue-800 text-sm underline transition cursor-pointer"
                >
                    ← Back to Dashboard
                </button>
            {/* Product Card */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Product Image */}
                    <div className="bg-white rounded-xl shadow-md p-8 flex justify-center items-center">
                        <img
                            src={imageUrl}
                            alt={product.productName}
                            className="max-h-125 object-contain"
                        />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-blue-600 uppercase mb-2">
                            {product.category}
                        </span>
                        <h1 className="text-4xl font-bold text-gray-800">
                            {product.productName}
                        </h1>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="text-yellow-500 text-lg">
                                {[...Array(5)].map((_, i) => (
                                    <FontAwesomeIcon
                                        key={i}
                                        icon={faStar}
                                        className={`text-sm ${
                                            i < Math.floor(product.rating)
                                                ? "text-yellow-400"
                                                : i < product.rating
                                                ? "text-yellow-400/50"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>

                            <span className="text-yellow-600">
                                {product.rating} / 5
                            </span>

                            <span className="text-gray-500">
                                ({product.reviewCount})
                            </span>
                            <button
                                onClick={() => {
                                    if(isMerchant){
                                        navigate(`/merchant/my_products/${productId}/all_reviews`)
                                    }
                                    else{
                                        navigate(`/products/${productId}/all_reviews`)
                                    }
                                }}
                                className="ml-auto text-blue-600 hover:text-blue-800 text-sm underline transition cursor-pointer"
                            >
                                View All Reviews
                            </button>
                        </div>
                        <h2 className="mt-6 text-4xl font-bold text-green-600">
                            ₹{product.price}
                        </h2>
                        <p className="mt-2 text-gray-700">
                            <span className="font-semibold">Stock:</span>{" "}
                            <span
                                className={`font-semibold ${
                                    product.stock > 10
                                        ? "text-green-600"
                                        : product.stock > 0
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                }`}
                            >
                                {product.stock > 0 ? `${product.stock} Available` : "Out of Stock"}
                            </span>
                        </p>
                        <p className="mt-2 text-gray-600">
                            Sold by <span className="font-semibold">{product.merchantName}</span>
                        </p>
                        <hr className="my-6" />
                        
                        <div>
                            <h3 className="text-xl font-semibold mb-3">
                                Description
                            </h3>
                            <p className="text-gray-700 leading-7">
                                {product.description}
                            </p>
                        </div>
                        {isMerchant?
                            <MerchantOptions />
                        :
                            <>
                                <div className="flex flex-col gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={
                                            isAddingToCart ||
                                            product.stock <= 0
                                        }
                                        className="bg-blue-600 hover:bg-blue-700
                                                disabled:bg-gray-400 disabled:cursor-not-allowed
                                                text-white px-8 py-3 rounded-lg font-semibold
                                                transition cursor-pointer"
                                    >
                                        {product.stock <= 0
                                            ? "Out of Stock"
                                            : isAddingToCart
                                                ? "Adding..."
                                                : "Add to Cart"
                                        }
                                    </button>

    {cartMessage && (
        <p
            className={`text-sm text-center ${
                cartMessage.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
            }`}
        >
            {cartMessage}
        </p>
    )}

    {/* Buy Now */}
    <div className="flex gap-4 mt-2">

        {count === 0 ? (
            <button
                type="button"
                disabled={product.stock <= 0}
                className="flex-1 bg-green-600 hover:bg-green-700 
                           disabled:bg-gray-400 disabled:cursor-not-allowed 
                           text-white px-8 py-3 rounded-lg font-semibold 
                           transition cursor-pointer"
                onClick={addCount}
            >
                Buy Now
            </button>
        ) : (
            <>
                <div className="flex items-center justify-center gap-3 px-4 border border-green-600 rounded-lg flex-1">

                    <button
                        type="button"
                        onClick={subCount}
                        className="w-9 h-9 rounded-lg bg-gray-100 
                                   hover:bg-gray-200 active:scale-95 
                                   transition cursor-pointer"
                    >
                        -
                    </button>

                    <span className="text-lg font-semibold w-6 text-center">
                        {count}
                    </span>

                    <button
                        type="button"
                        disabled={count >= Math.min(product.stock, 9)}
                        onClick={addCount}
                        className="w-9 h-9 rounded-lg bg-green-500 text-white 
                                   hover:bg-green-600 disabled:opacity-50 
                                   disabled:cursor-not-allowed 
                                   active:scale-95 transition cursor-pointer"
                    >
                        +
                    </button>

                </div>

                <button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white 
                               px-8 py-3 rounded-lg font-semibold 
                               transition cursor-pointer"
                    onClick={() => navigate("/checkout")}
                >
                    Checkout
                </button>
            </>
        )}

    </div>
                                </div>
                                <ReviewSection
                                    productId={productId}
                                    isLoggedIn={isLoggedIn}
                                />
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;