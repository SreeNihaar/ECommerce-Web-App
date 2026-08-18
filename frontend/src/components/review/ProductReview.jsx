import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const ProductReview = ({review,index}) =>{
    
    return (
        <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
        >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{review.userName}</p>
                    <p className="text-sm text-gray-500">
                        {review.updatedAt ? new Date(review.updatedAt).toLocaleString() : ""}
                    </p>
                </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={`text-sm ${
                                i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                            }`}
                        />
                    ))}
                </div>
                <span className="font-semibold text-gray-700">
                    {review.rating} / 5
                </span>
            </div>
        </div>

        {/* Comment */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                {review.comment}
            </p>
        </div>
    </div>
    );
}

export default ProductReview;