import samsungTv from "../assets/samsung_tv.jpg";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function ViewProduct(){
    const rating = 3;
    const navigate = useNavigate();
   
    return(
        <div className="product cursor-pointer shadow-xl bg-gray-100 border border-black w-full h-fit p-4"
                onClick={()=>navigate("/products/101")} >
            <div className="imageDiv mt-1 flex justify-center">
                <img src={samsungTv} className='size-50' alt="Samsung TV" />
            </div>
            <div className="description flex flex-col mt-3">
                <div className="product-child-1">
                    <h1 className='productName font-medium text-2xl pl-3'>Samsung TV</h1>
                </div>
                <div className="product-child-2 flex mt-3 flex-col gap-3">
                    <div className="flex justify-between">
                        <div className="category italic">
                            <h5>Electronics</h5>
                        </div>
                        <div className="price font-medium text-xl">
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
                        <span className="text-sm text-gray-600">{rating}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;