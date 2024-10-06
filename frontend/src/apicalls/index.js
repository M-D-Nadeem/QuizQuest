import axios from 'axios'

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:6001/',
    baseURL: 'https://quizquest-im84.onrender.com',
    headers: {
       'authorization': `Bearer ${localStorage.getItem('token')}`
    }
})

export default axiosInstance


