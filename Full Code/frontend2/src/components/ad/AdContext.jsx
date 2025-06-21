import { createContext, useContext, useState } from 'react';

// Create the context object
const PromoContext = createContext();

// Define the provider component
export const PromoProvider = ({ children }) => {
    // State to trigger promo refreshes, initialized to 0
    const [refreshPromos, setRefreshPromos] = useState(0);

    // Function to increment the refresh counter
    const triggerPromoRefresh = () => {
        setRefreshPromos(prev => prev + 1);
    };

    // Provide the context value to children components
    return (
        <PromoContext.Provider value={{ refreshPromos, triggerPromoRefresh }}>
            {children}
        </PromoContext.Provider>
    );
};

// Custom hook to access the context
export const usePromoContext = () => useContext(PromoContext);