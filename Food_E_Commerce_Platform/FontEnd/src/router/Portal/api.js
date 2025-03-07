import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Hàm gọi API với xử lý lỗi sẵn
const fetchData = async (url) => {
  try {
    const { data } = await API.get(url);
    return data;
  } catch (error) { 
    console.error(`API error on ${url}:`, error);
    return null; // Tránh lỗi không kiểm soát
  }
};

export const fetchSubItems = (categoryId) => fetchData(`/subitems/${categoryId}`);
export const searchSubItems = (query) => fetchData(`/subitems/search?q=${query}`);
export const fetchCategories = () => fetchData("/categories");
