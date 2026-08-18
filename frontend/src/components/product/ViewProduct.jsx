import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import {useData} from "../../context/CheckoutContext.jsx";
import AuthenticationService from "../../api/authentication/AuthenticationService.js";

function ViewProduct({product,isMyProducts}){
    const navigate = useNavigate();

    const config = import.meta.env;

    const { checkoutMap, updateCheckoutItem } = useData();
    const count = (checkoutMap[product.id]) ? checkoutMap[product.id].count : 0;
    const imageUrl = `https://${config.VITE_S3_BUCKET}.s3.${config.VITE_AWS_REGION}.amazonaws.com/${product.imageKey}`;
    
    const addCount = (e) => {
        e.stopPropagation();
        if(!AuthenticationService.isUserLoggedIn()){
            navigate("/login");
            return;
        }

        if (count < 9 && count < product.quantity) {
            const newValue = count + 1;
            updateCheckoutItem(product, newValue);
        }
    };

    function subCount(e) {
        e.stopPropagation();
        if(!AuthenticationService.isUserLoggedIn()){
            navigate("/login");
            return;
        }
        if (count > 0) {
            const newValue = count - 1;
            updateCheckoutItem(product, newValue);
        }
    }
    
    return(
        <div className={`product bg-white rounded-2xl my-3 border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer
                ${(count !== 0) ? 'border-red-500 ring-1 ring-red-200' : 'border-black'}`} onClick={()=>{
                    if(!isMyProducts) navigate(`/products/${product.id}`)
                    else navigate(`/merchant/my_products/${product.id}`)
                }}  >
            <div className={`imageDiv bg-gray-50 flex justify-center items-center ${(!isMyProducts)?'h-44':'h-60'} overflow-hidden`}>
                <img src={imageUrl} className='h-44 object-contain transition-transform duration-300 group-hover:scale-105' alt={product.productName} />
            </div>
            <div className="description p-4">
                <h1 className='productName text-xl font-semibold mb-2'>{product.productName}</h1>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="category text-sm text-gray-500 font-medium">
                            <h5>{product.category}</h5>
                        </div>
                        <div className="price text-2xl font-bold text-gray-900">
                            <h3>₹ {product.price}</h3>
                        </div>
                    </div>
                    <div className="rating flex items-center gap-2">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : i < product.rating ? 'text-yellow-400/50' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                    {
                        (!isMyProducts)?
                        <div>
                            {
                                (count === 0) ?
                                (
                                    <div className="flex justify-center">
                                        <button className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold whitespace-nowrap cursor-pointer" onClick={addCount}>
                                            Add to Checkout
                                        </button>
                                    </div>
                                ) :
                                (
                                    <div className="flex items-center justify-center gap-3">
                                        <button className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition cursor-pointer" onClick={subCount}>
                                            -
                                        </button>

                                        <span className="text-lg font-semibold w-6 text-center">
                                            {count}
                                        </span>

                                        <button className="w-9 h-9 rounded-lg bg-red-500 text-white hover:bg-red-600 active:scale-95 transition cursor-pointer" onClick={addCount}>
                                            +
                                        </button>
                                    </div>
                                )
                            }
                        </div>:
                        <></>
                    }
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;