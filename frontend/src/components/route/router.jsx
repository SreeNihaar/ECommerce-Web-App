import { createBrowserRouter } from "react-router-dom";

import ProductDashboard from "../ProductDashboard.jsx";
import Layout from "../Layout.jsx";
import ProductLayout from "../ProductLayout.jsx";
import Loading from "../Loading.jsx";
import { lazy } from "react";

const Product = lazy(()=>import("../Product.jsx"));
const SignUp = lazy(()=> import("../SignUp.jsx"));
const Login = lazy(()=> import("../Login.jsx"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ProductDashboard />
            }
        ]
    },
    {
        path: "/products",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ProductDashboard />
            }
        ]
    },
    {
        path: "/products/:productId",
        element: <ProductLayout />,
        children: [
            {
                index: true,
                element: <Product />
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <SignUp />
    }
]);

export default router;