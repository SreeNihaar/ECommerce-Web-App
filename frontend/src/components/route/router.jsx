import { createBrowserRouter } from "react-router-dom";

import ProductDashboard from "../product/ProductDashboard.jsx";
import Layout from "../Layout.jsx";
import ProductLayout from "../product/ProductLayout.jsx";
import { lazy } from "react";
import Profile from "../consumer/Profile.jsx";

const Product = lazy(()=>import("../product/Product.jsx"));
const SignUp = lazy(()=> import("../authentication/SignUp.jsx"));
const Login = lazy(()=> import("../authentication/Login.jsx"));

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
    },
    {
        path: "/myprofile",
        element: <Profile />
    }
]);

export default router;