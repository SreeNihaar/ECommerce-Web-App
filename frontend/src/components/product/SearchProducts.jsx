import { useState, useEffect } from "react";
import { lazy, Suspense } from "react";
import Loading from "../Loading.jsx";
import { useSearchParams } from "react-router-dom";
import { usePagination } from "../../context/PaginationContext.jsx";
import ProductService from "../../api/product/ProductService.js";

const ViewProduct = lazy(()=>import("./ViewProduct.jsx"));

function SearchProducts(){
    const [productResponseList, setProductResponseList] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchParams] = useSearchParams();

    const query = searchParams.get("query") || "";
    const page = searchParams.get("page") || 1;
    const size = searchParams.get("size") || 8;

    const {setTotalPages} = usePagination();

    useEffect(() => {
        if(!query.trim()){
            setProductResponseList([]);
            setNoResults(false);
            return;
        }

        ProductService.searchProducts(query, page,size).then(
            (res) => {
                if(res != null){
                    setProductResponseList(res.body.content);
                    setTotalPages(res.body.totalPages);
                    setNoResults(res.body.content.length === 0);
                }
            }
        )
        .catch((err) => {
            setProductResponseList([]);
            setNoResults(true);
            console.error("Error searching products");
        })

    }, [query, page]);

    return(
        <div className="SearchProducts pt-7 px-5">
            {query && <h2 className="text-2xl font-bold mb-6">Search results for "{query}"</h2>}
            {noResults && <p className="text-center text-gray-500 text-lg">No products found matching your search.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
                {productResponseList.map(product =>{
                    return <ViewProduct key={product.id} product={product} isMyProducts={false}/>
                })}
            </div>
        </div>
    );
}

export default SearchProducts;
