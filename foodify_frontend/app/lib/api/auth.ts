// import { LoginData, RegisterData } from "@/app/(auth)/schema"
// import axios from "./axios"
// import { API } from "./endpoints"


// export const register = async (registerData: RegisterData) => {
//     try {
//         const response = await axios.post(API.AUTH.REGISTER, registerData)
//         return response.data
//     } catch (error: Error | any) {
//         throw new Error(error.response?.data?.message || error.message || 'Registration failed')
//     }
// }

// export const login = async (loginData: LoginData) => {
//     try {
//         const response = await axios.post(API.AUTH.LOGIN, loginData)
//         return response.data
//     } catch (error: Error | any) {
//         throw new Error(error.response?.data?.message || error.message || 'Login failed')
//     }
// }

import { LoginData, RegisterData } from "@/app/(auth)/schema"
import axios from "./axios"
import { API } from "./endpoints"

export const register = async (registerData: RegisterData) => {
    try {
        const response = await axios.post(API.AUTH.REGISTER, registerData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
}

export const login = async (loginData: LoginData) => {
    try {
        const response = await axios.post(API.AUTH.LOGIN, loginData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
}

// 🆕 ADD THESE
export const whoAmI = async () => {
    try {
        const response = await axios.get(API.AUTH.PROFILE);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile');
    }
}

export const updateProfile = async (userId: string, profileData: FormData) => {
    try {
        const response = await axios.put(
            `${API.AUTH.UPDATE_PROFILE}${userId}`,
            profileData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Update profile failed');
    }
}