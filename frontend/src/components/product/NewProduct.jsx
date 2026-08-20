import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../../api/authentication/AuthenticationService';
import ProductService from '../../api/product/ProductService';

function NewProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        category: '',
        price: '',
        stock: ''
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
        setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const validateForm = () => {
        if (!formData.productName.trim()) return 'Product name is required';
        if (!formData.description.trim()) return 'Description is required';
        if (!formData.category.trim()) return 'Category is required';
        if (!formData.price || parseFloat(formData.price) <= 0) return 'Price must be greater than 0';
        if (!formData.stock || parseInt(formData.stock) < 0) return 'Stock must be 0 or greater';
        if (!image) return 'Product image is required';

        if(formData.description.length>1000) return 'Description must be less than 1000 cahracters';
        if(formData.productName.length>50) return 'Product Name musvt be less than 50 characters';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const form = new FormData();

            form.append(
                'product',
                new Blob(
                    [JSON.stringify({
                        productName: formData.productName,
                        description: formData.description,
                        category: formData.category,
                        price: parseFloat(formData.price),
                        stock: parseInt(formData.stock)
                    })],
                    { type: 'application/json' }
                )
            );

            form.append('image', image);

            const response = await ProductService.addProduct(form);

            setSuccess(
                response.message
            );

            setFormData({
                productName: '',
                description: '',
                category: '',
                price: '',
                stock: ''
            });

            setImage(null);
            setImagePreview(null);

            setTimeout(() => {
                navigate('/products');
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to add product. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        if(!AuthenticationService.isUserLoggedIn()){
            navigate("/login");
        }
    },[]);

        return(
            <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
                <div className="bg-white w-full max-w-2xl p-6 rounded-lg border">

                <h1 className="text-2xl font-bold text-blue-600 mb-6">Add New Product</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-600 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block mb-1 font-medium">Product Name</label>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter product description"
                            rows="4"
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                            <label className="block mb-1 font-medium">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                placeholder="Enter category"
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="block mb-1 font-medium">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="0"
                                min="0"
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Product Image</label>
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

                        {imagePreview && (
                            <div className="mt-3">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-40 h-40 object-cover rounded border"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="mt-2 px-3 py-1 text-sm text-red-600 border border-red-300 rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="flex-1 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewProduct;
