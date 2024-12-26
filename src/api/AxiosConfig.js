import axios from 'axios';

// Create an instance of axios with the base URL of your API
const api = axios.create({
    baseURL: 'https://da2-ghy9.onrender.com/api', // Base URL for the backend API
    headers: {
        'Content-Type': 'application/json', // Default header for all requests
    },
});

// Export the axios instance for use in other parts of the application
export default api;
