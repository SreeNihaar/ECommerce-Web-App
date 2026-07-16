import React, { useEffect, useState } from "react";
import productService from "../api/product/ProductService";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Product = () =>{
    const [product , setProduct] = useState({});
    const productId = useParams().productId;

    function isNumber(str) {
        return typeof str === "string" && /^[1-9]\d*$/.test(str);
    }
    
    
    useEffect(()=>{
        if(!isNumber(productId)){
            console.error("Error fetching product. Product Id is not Valid Number");
            return;
        }
        console.log(Number(productId))
        productService.getProductById(Number(productId))
            .then((res)=>{
                console.log(res.body);
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
                        <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition cursor-pointer">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;