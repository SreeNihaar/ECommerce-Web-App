import { useState, useEffect } from "react";
import { lazy, Suspense } from "react";
import Loading from "../Loading.jsx";
import { useSearchParams } from "react-router-dom";
import { usePagination } from "../../context/PaginationContext.jsx";
import ProductService from "../../api/product/ProductService.js";

const ViewProduct = lazy(()=>import("./ViewProduct.jsx"));

function ProductDashboard(){
    const [productResponseList, setProductResponseList] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const page = searchParams.get("page") || 1;
    
    const {setTotalPages} = usePagination();

    useEffect(() => {
        ProductService.getAllProducts(page).then(
            (res) => {
                if(res != null){
                    console.log(res)
                    setProductResponseList(res.body.content);
                    setTotalPages(res.body.totalPages);
                }
            }
        )
        .catch((err) => {
            console.error("Error fetching products:", err);
        })
    }, [searchParams]);

    return(
        <Suspense fallback={<Loading />}>
            <div className="ProductDashboard pt-7 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
                {productResponseList.map(product =>{
                    return <ViewProduct key={product.id} product={product}/>
                })}
            </div>
        </Suspense >
    );
}

export default ProductDashboard;