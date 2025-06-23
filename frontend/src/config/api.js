const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    return fetch(url, options);
};

export { API_BASE_URL };