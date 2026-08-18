import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../api/product/ProductService.js";

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const config = import.meta.env;

    const [formData, setFormData] = useState({
        productName: "",
        description: "",
        category: "",
        price: "",
        stock: "",
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productService.getProductById(Number(productId));
                setFormData({
                    productName: response.body.productName || "",
                    description: response.body.description || "",
                    category: response.body.category || "",
                    price: response.body.price || "",
                    stock: response.body.stock || "",
                });
                const imageLink = `https://${config.VITE_S3_BUCKET}.s3.${config.VITE_AWS_REGION}.amazonaws.com/${response.body.imageKey}`;
                setImagePreview(imageLink);
                setLoading(false);
            } catch (err) {
                setError("Failed to load product details");
                console.error("Error fetching product:", err);
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            if (!formData.productName.trim()) {
                setError("Product name is required");
                setIsSubmitting(false);
                return;
            }
            if (!formData.description.trim()) {
                setError("Description is required");
                setIsSubmitting(false);
                return;
            }
            if (!formData.category.trim()) {
                setError("Category is required");
                setIsSubmitting(false);
                return;
            }
            if (parseFloat(formData.price) <= 0) {
                setError("Price must be greater than 0");
                setIsSubmitting(false);
                return;
            }
            if (parseInt(formData.stock) < 0) {
                setError("Stock cannot be negative");
                setIsSubmitting(false);
                return;
            }

            const formDataPayload = new FormData();
            formDataPayload.append("productDto", new Blob([JSON.stringify({
                    productName: formData.productName.trim(),
                    description: formData.description.trim(),
                    category: formData.category.trim(),
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                })], { type: "application/json" })
            );
            
            if (image) {
                formDataPayload.append("image", image);
            }

            await productService.updateProduct(productId, formDataPayload);
            navigate(`/merchant/my_products/${productId}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update product");
            console.error("Error updating product:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-full flex items-center justify-center p-8">
                <div className="text-gray-600">Loading product details...</div>
            </div>
        );
    }

    return (
        <div className="min-h-full flex items-center justify-center p-8">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Product</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Image
                        </label>
                        <div className="flex flex-col gap-4">
                            {imagePreview && (
                                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="
                                    w-full
                                    text-sm text-gray-600
                                    file:mr-4
                                    file:px-4
                                    file:py-2
                                    file:rounded-lg
                                    file:border-0
                                    file:bg-blue-600
                                    file:text-white
                                    file:font-medium
                                    file:cursor-pointer
                                    hover:file:bg-blue-700
                                    cursor-pointer
                                "
                            />
                            <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Enter product name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                            placeholder="Enter product description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Enter product category"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
                        >
                            {isSubmitting ? "Updating..." : "Update Product"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
