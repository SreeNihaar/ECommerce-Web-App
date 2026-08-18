import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useData } from "../context/CheckoutContext";
import { usePagination } from "../context/PaginationContext";

function Footer() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const {totalPages} = usePagination();
    const location = useLocation();
    // const totalPages = 48;

    const { checkoutMap, updateCheckoutItem, clearCheckout } = useData();
    
    //TODO: Need to get the keys of cartMap Replace this with your actual cart count
    const countItems = Object.keys(checkoutMap).length;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1, 2);

            if (currentPage > 4) pages.push("...");

            for (
                let i = Math.max(3, currentPage - 1);
                i <= Math.min(totalPages - 2, currentPage + 1);
                i++
            ) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 3) pages.push("...");

            pages.push(totalPages - 1, totalPages);
        }

        return pages;
    };

    const changePage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page);

        navigate({
            pathname: location.pathname,
            search: `?${params.toString()}`
        });
    };

    return (
        <>
            <footer className="relative flex justify-center items-center py-4 border-t bg-white">

                {/* Pagination */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => changePage(Math.max(1,currentPage -1))}
                        disabled={currentPage === 1}
                        className={`${
                            currentPage === 1 ? "" : "cursor-pointer"
                        } px-4 py-2 text-blue-600 disabled:text-gray-400`}
                    >
                        Previous
                    </button>

                    {getPageNumbers().map((page, idx) => (
                        <button
                            key={idx}
                            onClick={() =>
                                typeof page === "number" &&
                                changePage(page)
                            }
                            disabled={page === "..."}
                            className={`px-3 py-2 border rounded-md ${
                                page === currentPage
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "border-gray-300 text-gray-700 hover:border-blue-600"
                            } ${
                                page === "..."
                                    ? "cursor-default"
                                    : "cursor-pointer"
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => changePage(Math.min(totalPages,currentPage+1))}
                        disabled={currentPage === totalPages || totalPages===0}
                        className={`${
                            currentPage === totalPages ? "" : "cursor-pointer"
                        } px-4 py-2 text-blue-600 disabled:text-gray-400`}
                    >
                        Next
                    </button>
                </div>

                {/* Desktop Checkout */}
                {countItems > 0 &&
                    <button
                        onClick={() => navigate("/checkout")}
                        className="hidden md:flex absolute right-6 items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl transition cursor-pointer"
                    >
                        <div className="relative">
                            <FontAwesomeIcon icon={faCartShopping} className="text-lg" />
                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {countItems}
                            </span> 
                        </div>
                        Checkout
                    </button>
                }
            </footer>

            {/* Mobile Floating Checkout */}
            {countItems >0 &&
                <button
                    onClick={() => navigate("/checkout")}
                    className="fixed bottom-5 right-5 md:hidden w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-xl flex items-center justify-center cursor-pointer"
                >
                    <div className="relative">
                        <FontAwesomeIcon icon={faCartShopping} className="text-xl" />
                        {countItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {countItems}
                            </span>
                        )}
                    </div>
                </button>
            }
        </>
    );
}

export default Footer;