import axios from "axios"

const axiosInstance=axios.create({
    baseURL:'http://localhost:4000/',
    headers:{
        "Authorization":`bearer ${localStorage.getItem('token')}`
    },
    timeout:10000,
})

export default axiosInstance;