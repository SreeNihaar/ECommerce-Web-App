import React,{createContext, useContext, useState} from "react";

const CheckoutContext = createContext(null);

const CheckoutProvider = ({children}) =>{
    const [checkoutMap,setCheckoutMap] = useState({});

    function updateCheckoutItem(item,count){
        setCheckoutMap((prev)=>{
            if(!prev){
                return {[item.id]:{item,count}};
            }
            const newObject={...prev};
            if(count===0){
                delete newObject[item.id];
                return newObject;
            }
            return {
                ...prev,
                [item.id]:{item,count}
            }
        });
    }

    return (
        <CheckoutContext.Provider value={{checkoutMap, updateCheckoutItem}}>
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