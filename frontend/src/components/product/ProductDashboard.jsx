import { useState, useEffect } from "react";
import { lazy, Suspense } from "react";
import Loading from "../Loading.jsx";
import { useSearchParams, useLocation } from "react-router-dom";
import { usePagination } from "../../context/PaginationContext.jsx";
import ProductService from "../../api/product/ProductService.js";

const ViewProduct = lazy(()=>import("./ViewProduct.jsx"));

function ProductDashboard(){
    const [productResponseList, setProductResponseList] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const location = useLocation();

    const isMyProducts = location.pathname.includes("/my_products")

    const page = searchParams.get("page") || 1;

    const {setTotalPages} = usePagination();

    useEffect(() => {
        const fetchProducts = isMyProducts
        ? ProductService.getAllProductsOfMerchant
        : ProductService.getAllProducts;
        
        fetchProducts(page).then(
            (res) => {
                if(res != null){
                    setProductResponseList(res.body.content);
                    setTotalPages(res.body.totalPages);
                }
            }
        )
        .catch((err) => {
            console.error("Error fetching products");
        })
        
    }, [page,isMyProducts]);

    return(
        <Suspense fallback={<Loading />}>
            <div className="ProductDashboard pt-7 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
                {productResponseList.map(product =>{
                    return <ViewProduct key={product.id} product={product} isMyProducts={isMyProducts}/>
                })}
            </div>
        </Suspense >
    );
}

export default ProductDashboard;