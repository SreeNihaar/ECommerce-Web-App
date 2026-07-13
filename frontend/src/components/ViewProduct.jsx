import React from 'react';
import samsungTv from "../assets/samsung_tv.jpg";

function ViewProduct(){
    return(
        <div className="product cursor-pointer shadow-xl bg-gray-100 border border-black w-full h-fit p-4" onClick={()=>console.log("Clicked!!")} >
            <div className="imageDiv mt-1 flex justify-center">
                <img src={samsungTv} className='size-50' alt="Samsung TV" />
            </div>
            <div className="description flex flex-col mt-3">
                <div className="product-child-1">
                    <h1 className='productName font-medium text-2xl pl-3'>Samsung TV</h1>
                </div>
                <div className="product-child-2 flex mt-3 flex-row justify-evenly">
                    <div className="category italic">
                        <h5>Electronics</h5>
                    </div>
                    <div className="price font-medium text-xl">
                        <h3>$543.44</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;