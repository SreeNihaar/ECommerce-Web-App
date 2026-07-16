import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CheckoutProvider } from "../context/CheckoutContext";

const Layout = () =>{
    return (
        <div className="layout flex flex-col min-h-screen">
            <Navbar />
            
            <CheckoutProvider>
                <main className="flex-1 flex items-center justify-center">
                    <Outlet />
                </main>
                <Footer />
            </CheckoutProvider>
        </div>
    );
}

export default Layout;