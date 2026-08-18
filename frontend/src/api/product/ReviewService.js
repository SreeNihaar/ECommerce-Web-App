import AuthenticationService from "../authentication/AuthenticationService";
import axios from "../customAxiosConfig/CustomAxiosConfig";

const config = import.meta.env;

class ReviewService{
    
    getAllProductReviews = async (id,page) =>{
        try{
            if(page === null){
                page=1;
            }
            const response = await axios.get(`${config.VITE_BACKEND_API}/review/${id}/all?page=${page}&size=5`);
            return response.data;
        }
        catch(err) {
            console.error('Failed to fetch product reviews for product ID:', id, err);
            throw err;
        }
    }


    getUserReview = async (productId) =>{
        try{
            const url = `${config.VITE_BACKEND_API}/review/${productId}`;
            const response = await axios.get(url,{
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data;
        }
        catch (err){
            console.error("Error fetching user review:", err);
            throw err;
        }
    }

    createReview = async (productId, body) =>{
        try{
            const url = `${config.VITE_BACKEND_API}/review/${productId}`;
            const response = await axios.post(url, body, {
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data;
        }
        catch (err){
            console.error('Failed to create review for product:', productId, err);
            throw err;
        }
    }

    updateReview = async (id,body) =>{
        try{
            const url = `${config.VITE_BACKEND_API}/review/${id}`;
            const response = await axios.patch(url,body,{
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });

            return response.data;
        }
        catch (err){
            console.error('Failed to update review:', id, err);
            throw err;
        }
    }

    deleteReview  = async (id) =>{
        try{
            const url = `${config.VITE_BACKEND_API}/review/${id}`;
            const response = await axios.delete(url,{
                headers: {
                    Authorization: `Bearer ${AuthenticationService.getToken()}`
                }
            });
            return response.data;
        }
        catch (err){
            console.error('Failed to delete review:', id, err);
            throw err;
        }
    }

}

export default new ReviewService();