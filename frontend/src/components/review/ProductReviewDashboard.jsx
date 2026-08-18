import { useEffect, useState} from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import reviewService from "../../api/product/ReviewService.js";
import ProductReview from "./ProductReview.jsx";
import { usePagination } from "../../context/PaginationContext.jsx";

const ProductReviewDashboard = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const isMerchant = location.pathname.includes("/my_products");
    const [reviews, setReviews] = useState([]);
    const [pageData, setPageData] = useState({
        page: 1,
        size: 5,
        totalElements: 0,
        totalPages: 0,
        last: false
    });

    const {setTotalPages} = usePagination();

    const currentPage = parseInt(searchParams.get("page")) || 1;

    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage, productId]);

    const fetchReviews = async (page) => {
        try {
            const response = await reviewService.getAllProductReviews(productId, page);
            setReviews(response.body.content);
            setPageData({
                page: response.body.page,
                size: response.body.size,
                totalElements: response.body.totalElements,
                totalPages: response.body.totalPages,
                last: response.body.last
            });
            setTotalPages(response.body.totalPages);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };


    return (
        <div className="w-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto w-full">
                {/* Back Button */}
                <button
                    onClick={() =>{
                        if(isMerchant){
                            navigate(`/merchant/my_products/${productId}`)
                        }
                        else{
                            navigate(`/products/${productId}`)
                        }
                    }}
                    className="mb-6 text-blue-600 hover:text-blue-800 text-sm underline transition cursor-pointer"
                >
                    ← Back to Product
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Reviews</h1>
                    <p className="text-gray-600">
                        {pageData.totalElements} reviews • Page {pageData.page+1} of {pageData.totalPages}
                    </p>
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-500">No reviews yet for this product.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review, index) => {
                            return <ProductReview review={review} key={index}/>
                        })}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductReviewDashboard;
