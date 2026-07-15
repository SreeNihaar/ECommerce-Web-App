import { useState, useEffect } from "react";
import GetAllProducts from "../api/product/GetAllProducts";
import { lazy, Suspense } from "react";
import Loading from "./Loading";
import { useSearchParams } from "react-router-dom";

const ViewProduct = lazy(()=>import("./ViewProduct"));

function ProductDashboard(){
    const [productResponseList, setProductResponseList] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const page = searchParams.get("page") || 1;
   
    useEffect(() => {
        GetAllProducts().then(
            (res) => {
                if(res != null)
                    setProductResponseList(res.body.content);
                console.log(res.body)
                console.log(page)
            }
        )
        .catch((err) => {
            console.error("Error fetching products:", err);
        })
    }, [searchParams]);

    return(
        <Suspense fallback={<Loading />}>
            <div className="ProductDashboard pt-7 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
                <ViewProduct />
                <ViewProduct />
                <ViewProduct />
                <ViewProduct />
                <ViewProduct />
            </div>
        </Suspense >
    );
}

export default ProductDashboard;