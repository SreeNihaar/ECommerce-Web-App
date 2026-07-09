import { useState, useEffect } from "react";
import Product from "./Product";
import GetAllProducts from "../api/product/GetAllProducts";

function Home(){
    const [productResponseList, setProductResponseList] = useState([]);

    useEffect(() => {
        GetAllProducts().then(
            (res) => {
                if(res.data != null)
                    setProductResponseList(res.data);
                console.log(res.data);
            }
        )
        .catch((err) => {
            console.error("Error fetching products:", err);
        })
    }, []);

    return(
        <div className="Home pt-7 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full h-[85vh] overflow-y-auto">

            <Product />
            <Product />
            <Product />
            <Product />
            <Product />
        </div>
    );
}

export default Home;