import { createBrowserRouter } from "react-router-dom";

import ProductDashboard from "../ProductDashboard.jsx";
import Login from "../Login.jsx";
import Signup from "../SignUp.jsx";
import Layout from "../Layout.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ProductDashboard />
            },
            {
                path: "hi",
                element: <h1>Hi</h1>
            },
            {
                path: "bye",
                element: <h1>Bye</h1>
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <Signup />
    }
]);

export default router;