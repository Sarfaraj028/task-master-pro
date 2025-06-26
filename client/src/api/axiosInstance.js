import axios from "axios"

const axiosInstance = axios.create({ //here API is instance of axios
    baseURL: import.meta.env.VITE_BACKEND_URL, // now You don't have to write baseURL again and again
    withCreadentials: true, // You can enable credentials (cookies) for login-protected routes
})

// 🌟 Attach token automatically if it exists
const token = localStorage.getItem("authToken");
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axiosInstance