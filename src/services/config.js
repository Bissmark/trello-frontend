// Utility function to get the correct backend URL based on environment
export const getBackendURL = () => {
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_EXPRESS_BACKEND_URL_PROD;
    }
    return import.meta.env.VITE_EXPRESS_BACKEND_URL_DEV;
};

// Export the backend URL as a constant for convenience
export const BACKEND_URL = getBackendURL();