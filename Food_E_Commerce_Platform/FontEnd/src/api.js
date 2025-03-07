import axios from 'axios';

const api = "http://localhost:3001";

export const getCustomers = async () => {
    try {
        const response = await axios.get(`${api}/customers`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return null;
    }
};

