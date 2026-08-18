import { createBrowserRouter } from "react-router-dom";

import ProductDashboard from "../product/ProductDashboard.jsx";
import Layout from "../Layout.jsx";
import NavbarLayout from "../product/NavbarLayout.jsx";
import { lazy } from "react";
import OrderById from "../orders/OrderById.jsx";
import EditProduct from "../product/EditProduct.jsx";

const Product = lazy(()=>import("../product/Product.jsx"));
const SignUp = lazy(()=> import("../authentication/SignUp.jsx"));
const Login = lazy(()=> import("../authentication/Login.jsx"));
const EditProfile = lazy(()=> import("../consumer/EditProfile.jsx"));
const Profile = lazy(()=> import("../consumer/Profile.jsx"));
const Orders = lazy(()=> import("../orders/Orders.jsx"));
const MyRequests = lazy(()=> import("../consumer/MyRequests.jsx"));
const MyRequestById = lazy(()=> import("../consumer/MyRequestById.jsx"));
const MerchantProfile = lazy(()=> import("../merchant/MyMerchantProfile.jsx"));
const EditMerchantProfile = lazy(()=> import("../merchant/EditMerchantProfile.jsx"));
const ProductReviewDashboard = lazy(() => import("../review/ProductReviewDashboard.jsx"));
const NewProduct = lazy(()=> import("../product/NewProduct.jsx"));
const MerchantAnalytics = lazy(() => import("../merchant/MerchantAnalytics.jsx"));
const MerchantOrders = lazy(() => import("../merchant/MerchantOrders.jsx"));
const AdminAnalytics = lazy(() => import("../admin/AdminAnalytics.jsx"));
const AdminUsersDashboard = lazy(() => import("../admin/AdminUsersDashboard.jsx"));
const AdminUserProfile = lazy(() => import("../admin/AdminUserProfile.jsx"));
const AdminMerchantsDashboard = lazy(() => import("../admin/AdminMerchantsDashboard.jsx"));
const AdminMerchantProfile = lazy(() => import("../admin/AdminMerchantProfile.jsx"));
const AdminMerchantRequests = lazy(() => import("../admin/AdminMerchantRequests.jsx"));
const AdminMerchantRequestDetail = lazy(() => import("../admin/AdminMerchantRequestDetail.jsx"));
const CheckoutCart = lazy(()=> import("../checkout/CheckoutCart.jsx"));
const MyCart = lazy(()=> import("../consumer/MyCart.jsx"));
const SearchProducts = lazy(() => import("../product/SearchProducts.jsx"));
const NotFound404 = lazy(() => import("../errors/NotFound404.jsx"));
const Forbidden403 = lazy(() => import("../errors/Forbidden403.jsx"));
const ServerError500 = lazy(() => import("../errors/ServerError500.jsx"));
const BadRequest400 = lazy(() => import("../errors/BadRequest400.jsx"));
const ServiceUnavailable503 = lazy(() => import("../errors/ServiceUnavailable503.jsx"));

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
        path: "/search",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <SearchProducts />
            }
        ]
    },
    {
        path: "/merchant/my_products",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ProductDashboard />
            }
        ]
    },
    {
        path: "/merchant/my_products/:productId",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <Product />
            }
        ]
    },
    {
        path: "/merchant/my_products/:productId/all_reviews",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ProductReviewDashboard />
            }
        ]
    },
    {
        path: "/merchant/my_products/edit/:productId",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <EditProduct />
            }
        ]
    },
    {
        path: "/products/:productId",
        element: <NavbarLayout />,
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
    },
    {
        path: "/myprofile/edit",
        element: <EditProfile />
    },
    {
        path: "/cart",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <MyCart />
            }
        ]
    },
    {
        path: "/checkout",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <CheckoutCart />
            }
        ]
    },
    {
        path: "/orders",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <Orders />
            }
        ]
    },
    {
        path: "/myorders/",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <Orders />
            }
        ]
    },
    {
        path: "/myorders/:orderId",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <OrderById />
            }
        ]
    },
    {
        path: "/myrequests",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <MyRequests />
            }
        ]
    },
    {
        path: "/myrequests/:requestId",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <MyRequestById />
            }
        ]
    },
    {
        path: "/products/:productId/all_reviews",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ProductReviewDashboard />
            }
        ]
    },
    {
        path: "/merchant/profile",
        element: <MerchantProfile />
    },
    {
        path: "/merchant/profile/edit",
        element: <EditMerchantProfile />
    },
    {
        path: "/merchant/products/new",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <NewProduct />
            }
        ]
    },
    {
        path: "/merchant/my_analytics",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <MerchantAnalytics />
            }
        ]
    },
    {
        path: "/merchant/orders",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <MerchantOrders />
            }
        ]
    },
    {
        path: "/admin/analytics",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <AdminAnalytics />
            }
        ]
    },
    {
        path: "/admin/users",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <AdminUsersDashboard />
            }
        ]
    },
    {
        path: "/admin/users/:userId",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <AdminUserProfile />
            }
        ]
    },
    {
        path: "/admin/merchants",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <AdminMerchantsDashboard />
            }
        ]
    },
    {
        path: "/admin/merchants/:merchantId",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <AdminMerchantProfile />
            }
        ]
    },
    {
        path: "/admin/merchant-requests",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <AdminMerchantRequests />
            }
        ]
    },
    {
        path: "/admin/merchant-requests/:requestId",
        element: <NavbarLayout />,
        children: [
            {
                index: true,
                element: <AdminMerchantRequestDetail />
            }
        ]
    },
    {
        path: "/error/400",
        element: <BadRequest400 />
    },
    {
        path: "/error/403",
        element: <Forbidden403 />
    },
    {
        path: "/error/404",
        element: <NotFound404 />
    },
    {
        path: "/error/500",
        element: <ServerError500 />
    },
    {
        path: "/error/503",
        element: <ServiceUnavailable503 />
    },
    {
        path: "*",
        element: <NotFound404 />
    }
]);

export default router;