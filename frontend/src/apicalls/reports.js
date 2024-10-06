import axiosInstance from "."


export const addReport = async(payload) => {
    try{
        const response = await axiosInstance.post('/api/reports/addReport',payload)
        return response.data
    }
    catch(error){
        return error.response.data
    }
}

export const getAllAttempts = async(payload) => {
    try{
        const response = await axiosInstance.post('/api/reports/getAllAttempts',payload)
        return response.data
    }
    catch(error){
        return error.response.data
    }
}


export const getAllAttemptsByUser = async() => {
    try{
        const response = await axiosInstance.get('/api/reports/getAllAttemptsByUser')
        console.log(response);
        
        return response.data
    }
    catch(error){
        return error.response.data
    }
}
export const getInfoGrouped=async()=>{
    try{
        const response=await axiosInstance.get("/api/reports/getinfogroup")
        console.log(response);
        return response.data
    }
    catch(error){
        return error.response.data
    }
}