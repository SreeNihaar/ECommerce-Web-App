import samsungTv from "../assets/samsung_tv.jpg";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import {useData} from "../context/CheckoutContext.jsx";

function ViewProduct(){
    const rating = 3;
    const navigate = useNavigate();

    const product = {
        id: 101,
        name: 'Samsung TV',
        price: 543.44,
        category: 'Electronics'
    };

    const { checkoutMap, updateCheckoutItem } = useData();
    const count = (checkoutMap[product.id]) ? checkoutMap[product.id].count : 0;

    function addCount(e) {
        e.stopPropagation();
        if (count < 9) {
            const newValue = count + 1;
            updateCheckoutItem(product, newValue);
        }
    }

    function subCount(e) {
        e.stopPropagation();
        if (count > 0) {
            const newValue = count - 1;
            updateCheckoutItem(product, newValue);
        }
    }
    
    return(
        <div className={`product bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer
                ${(count !== 0) ? 'border-red-500 ring-1 ring-red-200' : 'border-black'}`} onClick={()=>navigate("/products/101")}  >
            <div className="imageDiv bg-gray-50 flex justify-center items-center h-44 overflow-hidden">
                <img src={samsungTv} className='h-44 object-contain transition-transform duration-300 group-hover:scale-105' alt="Samsung TV" />
            </div>
            <div className="description p-4">
                <h1 className='productName text-xl font-semibold mb-2'>Samsung TV</h1>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="category text-sm text-gray-500 font-medium">
                            <h5>Electronics</h5>
                        </div>
                        <div className="price text-2xl font-bold text-gray-900">
                            <h3>$543.44</h3>
                        </div>
                    </div>
                    <div className="rating flex items-center gap-2">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : i < rating ? 'text-yellow-400/50' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
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
                                <div className="flex items-center justify-center gap-3" onClick={subCount}>
                                    <button className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition cursor-pointer">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;