import React,{createContext, useContext, useState} from "react";

const CheckoutContext = createContext(null);

const CheckoutProvider = ({children}) =>{
    const [checkoutMap,setCheckoutMap] = useState({});

    function updateCheckoutItem(product,count){
        setCheckoutMap((prev)=>{
            const updated = {...prev};
            if(count<=0){
                delete updated[product.id];
            } else {
                updated[product.id] = {
                    count
                };
            }

            console.log(updated);

            return updated;
        });
    }

    function clearCheckout(){
        console.log("Clearing the Checkout Items");
        setCheckoutMap({});
    }

    return (
        <CheckoutContext.Provider value={{checkoutMap, updateCheckoutItem, clearCheckout}}>
            {children}
        </CheckoutContext.Provider>
    );
}

const useData = () =>{
    const ctx = useContext(CheckoutContext);
    if(!ctx){
        throw new Error("useData must be inside DataProvider");
    }
    return ctx;
}

export {CheckoutProvider, useData};