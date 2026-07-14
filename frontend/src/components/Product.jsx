import React, { useEffect, useState } from "react";
import productService from "../api/product/ProductService";
import { useParams } from "react-router-dom";

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
        <>
            <h1>
                {product.productName}
            </h1>
            <h1>{product.id}</h1>
            <h1>{product.category}</h1>
            <h1>{product.description}</h1>
            <h1>${product.price}</h1>
            <h1>{product.rating}</h1>
        </>
    );
}

export default Product;