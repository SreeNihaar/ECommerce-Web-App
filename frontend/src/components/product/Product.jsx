import { useEffect, useState } from "react";
import productService from "../../api/product/ProductService.js";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useData} from "../../context/CheckoutContext.jsx";
import AuthenticationService from "../../api/authentication/AuthenticationService.js";

const Product = () =>{
    const [product , setProduct] = useState({});
    const {checkoutMap,updateCheckoutItem} = useData();
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
    
    
    useEffect(()=>{
        if(!isNumber(productId)){
            console.error("Error fetching product. Product Id is not Valid Number");
            return;
        }
        productService.getProductById(Number(productId))
            .then((res)=>{
                setProduct(res.body);
            })
            .catch((err)=>{
                console.error("Error finding the product of Id: ",err);
            });
    },[]);

    
    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Product Image */}
                <div className="bg-white rounded-xl shadow-md p-8 flex justify-center items-center">
                    <img
                        src={`data:${product.imageType};base64,${product.imageData}`}
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
                    <p className="mt-2 text-yellow-500 text-lg">
                        {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : i < product.rating ? 'text-yellow-400/50' : 'text-gray-300'}`}
                                />
                            ))}
                        {" "}{product.rating} / 5
                    </p>
                    <h2 className="mt-6 text-4xl font-bold text-green-600">
                        ${product.price}
                    </h2>
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

                    <div className="flex gap-4 mt-8">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition cursor-pointer">
                            Add to Cart
                        </button>
                        {
                            (count === 0)?
                            (
                                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition cursor-pointer" onClick={addCount}>
                                    Buy Now
                                </button>
                            ):
                            (
                                <div className="flex items-center justify-center gap-3 px-4 border border-green-600 rounded-lg">
                                    <button className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition cursor-pointer" onClick={subCount}>
                                        -
                                    </button>

                                    <span className="text-lg font-semibold w-6 text-center">
                                        {count}
                                    </span>

                                    <button className="w-9 h-9 rounded-lg bg-red-500 text-white hover:bg-red-600 active:scale-95 transition cursor-pointer" onClick={addCount}>
                                        +
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;