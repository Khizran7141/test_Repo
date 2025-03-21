import axios from 'axios';

export const callPingAPI = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/ping');

        return {
            success: true,
            status: response.status,
            data: response.data,
            headers: response.headers,
        };
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            };
        }

        return {
            success: false,
            status: 'Network Error',
            data: { message: 'Network error or server unavailable.' },
            headers: {},
        };
    }
};
