import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "../Navbar";
import Loading from "../Loading";

const NavbarLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1">
                <Suspense fallback={<Loading />}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
};

export default NavbarLayout;