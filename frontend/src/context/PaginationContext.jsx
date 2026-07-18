import { createContext, useContext, useState } from "react";

const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {
    const [totalPages, setTotalPages] = useState(0);

    return (
        <PaginationContext.Provider
            value={{
                totalPages,
                setTotalPages
            }}
        >
            {children}
        </PaginationContext.Provider>
    );
};

export const usePagination = () => {
    return useContext(PaginationContext);
};