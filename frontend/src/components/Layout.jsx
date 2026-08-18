import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "./Navbar";
import Loading from "./Loading";
import Footer from "./Footer";

const Layout = () =>{
    return (
        <div className="layout flex flex-col min-h-screen">
            <Navbar />
                <Suspense fallback={<Loading />}>
                    <main className="flex-1 w-full">
                        <Outlet />
                    </main>
                </Suspense>
            <Footer />
        </div>
    );
}

export default Layout;