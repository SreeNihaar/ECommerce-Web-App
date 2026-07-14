import { useState, useEffect } from "react";
import ViewProduct from "./ViewProduct";
import GetAllProducts from "../api/product/GetAllProducts";

function ProductDashboard(){
    const [productResponseList, setProductResponseList] = useState([]);

    useEffect(() => {
        GetAllProducts().then(
            (res) => {
                if(res.data != null)
                    setProductResponseList(res.body);
                console.log(res.body);
            }
        )
        .catch((err) => {
            console.error("Error fetching products:", err);
        })
    }, []);

    return(
        <div className="ProductDashboard pt-7 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full h-[85vh] overflow-y-auto">
            <ViewProduct />
            <ViewProduct />
            <ViewProduct />
            <ViewProduct />
            <ViewProduct />
        </div>
    );
}

export default ProductDashboard;