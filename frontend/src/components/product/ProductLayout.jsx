import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { Suspense } from "react";
import Loading from "../Loading";

const ProductLayout = () =>{
    return (
        <div className="layout flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex items-center justify-center">
                <Suspense fallback={<Loading />}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
}

export default ProductLayout;
