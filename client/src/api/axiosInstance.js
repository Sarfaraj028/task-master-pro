import axios from "axios"

const axiosInstance = axios.create({ //here API is instance of axios
    baseURL: import.meta.env.VITE_BACKEND_URL, // now You don't have to write baseURL again and again
    withCreadentials: true, // You can enable credentials (cookies) for login-protected routes
})

export default axiosInstance