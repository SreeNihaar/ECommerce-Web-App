import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import reviewService from "../../api/product/ReviewService.js";
import AuthenticationService from "../../api/authentication/AuthenticationService.js";

const ReviewSection = ({ productId, isLoggedIn }) => {
    const [userReview, setUserReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [mode, setMode] = useState("view"); // view, edit, write
    const [form, setForm] = useState({ rating: 0, comment: "" });
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserReview();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, productId]);

    const fetchUserReview = async () => {
        try {
            setLoading(true);
            if(!AuthenticationService.isUserLoggedIn()){
                navigate("/login");
                return;
            }
            const response = await reviewService.getUserReview(productId);
            setUserReview(response.body);
        } catch (error) {
            setUserReview(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!window.confirm("Are you sure you want to delete your review?")) return;

        try {
            await reviewService.deleteReview(productId);
            setUserReview(null);
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete review:", error);
            alert("Failed to delete review. Please try again.");
        }
    };

    const handleEditClick = () => {
        setForm({ rating: userReview.rating, comment: userReview.comment });
        setMode("edit");
    };

    const handleSaveEdit = async () => {
        try {
            setSubmitting(true);
            await reviewService.updateReview(productId, form);
            setUserReview({ ...userReview, ...form });
            setMode("view");
            window.location.reload();
        } catch (error) {
            console.error("Failed to update review:", error);
            alert("Failed to update review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleWriteClick = () => {
        setForm({ rating: 0, comment: "" });
        setMode("write");
    };

    const handleSubmitReview = async () => {
        if (form.rating === 0) {
            alert("Please select a rating");
            return;
        }

        if (!form.comment.trim()) {
            alert("Please write a comment");
            return;
        }

        if(form.comment.length>1000){
            alert("Please write comment below 1000 characters.");
            return;
        }

        try {
            setSubmitting(true);
            await reviewService.createReview(productId, form);
            setMode("view");
            window.location.reload();
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Failed to submit review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setForm({ rating: 0, comment: "" });
        setMode("view");
    };

    if (loading) {
        return <div className="mt-8 p-4 text-center text-gray-500">Loading review...</div>;
    }

    return (
        <div className="mt-8 border-t pt-8 w-full">
            <h3 className="text-xl font-semibold mb-6">Your Review</h3>

            {!isLoggedIn ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                        Please log in to leave a review for this product.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition cursor-pointer"
                    >
                        Login to Review
                    </button>
                </div>
            ) : userReview && (mode === "view" || mode === "edit") ? (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 h-68 overflow-y-auto flex flex-col">

                    {/* Rating Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        disabled={mode === "view"}
                                        onClick={() =>
                                            mode === "edit" &&
                                            setForm(prev => ({
                                                ...prev,
                                                rating: i + 1
                                            }))
                                        }
                                        className={`p-0 transition ${
                                            mode === "edit"
                                                ? "cursor-pointer"
                                                : "cursor-default"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            className={`text-xl ${
                                                i < (form.rating || userReview.rating)
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-lg font-semibold text-gray-700">
                                {(form.rating || userReview.rating)} / 5
                            </span>
                        </div>

                        {mode === "view" && userReview.lastUpdated && (
                            <span className="text-sm text-gray-500">
                                {new Date(userReview.lastUpdated).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {/* Comment Section */}
                    <div className="mb-6 flex-1 overflow-hidden">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full overflow-y-auto">
                            {mode === "edit" ? (
                                <>
                                <textarea
                                    value={form.comment}
                                    onChange={(e) =>
                                        setForm(prev => ({
                                            ...prev,
                                            comment: e.target.value
                                        }))
                                    }
                                    className="w-full h-full resize-none bg-transparent text-gray-700 text-sm leading-relaxed outline-none border-0 p-0"
                                    placeholder="Update your review..."
                                />
                                </>
                            ) : (
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {userReview.comment}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons Section */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-2">
                        {mode === "view" ? (
                            <>
                                <button
                                    onClick={handleDeleteReview}
                                    className="px-5 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition cursor-pointer text-sm font-medium"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={handleEditClick}
                                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer text-sm font-medium"
                                >
                                    Edit Review
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancel}
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={
                                        submitting ||
                                        form.rating === 0 ||
                                        !form.comment.trim()
                                    }
                                    className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition cursor-pointer text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : mode === "write" ? (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 h-68 overflow-y-auto flex flex-col">

                    {/* Rating Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() =>
                                            setForm(prev => ({
                                                ...prev,
                                                rating: i + 1
                                            }))
                                        }
                                        className="p-0 transition cursor-pointer"
                                    >
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            className={`text-xl ${
                                                i < form.rating
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-lg font-semibold text-gray-700">
                                {form.rating} / 5
                            </span>
                        </div>
                    </div>

                    {/* Comment Section */}
                    <div className="mb-6 flex-1 overflow-hidden">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full overflow-y-auto">
                            <textarea
                                value={form.comment}
                                onChange={(e) =>
                                    setForm(prev => ({
                                        ...prev,
                                        comment: e.target.value
                                    }))
                                }
                                className="w-full h-full resize-none bg-transparent text-gray-700 text-sm leading-relaxed outline-none border-0 p-0"
                                placeholder="Share your thoughts about this product..."
                            />
                            
                                <p className="text-sm text-gray-500 text-right">
                                    {form.comment.length}/1000
                                </p>
                        </div>
                    </div>

                    {/* Action Buttons Section */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-2">
                        <button
                            onClick={handleCancel}
                            disabled={submitting}
                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitReview}
                            disabled={submitting}
                            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition cursor-pointer text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 text-center">
                    <p className="text-gray-700 mb-6">
                        You haven't reviewed this product yet. Share your thoughts!
                    </p>
                    <button
                        onClick={handleWriteClick}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition cursor-pointer text-sm"
                    >
                        Write a Review
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
