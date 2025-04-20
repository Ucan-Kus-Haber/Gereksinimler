import { createContext, useContext, useState } from 'react';

// Create the context object
const AdContext = createContext();

// Define the provider component
export const AdProvider = ({ children }) => {
    // State to trigger ad refreshes, initialized to 0
    const [refreshAds, setRefreshAds] = useState(0);

    // Function to increment the refresh counter
    const triggerAdRefresh = () => {
        setRefreshAds(prev => prev + 1);
    };

    // Provide the context value to children components
    return (
        <AdContext.Provider value={{ refreshAds, triggerAdRefresh }}>
            {children}
        </AdContext.Provider>
    );
};

// Custom hook to access the context
export const useAdContext = () => useContext(AdContext);