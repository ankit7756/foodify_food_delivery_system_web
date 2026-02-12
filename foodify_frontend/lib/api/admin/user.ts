import { API } from "../endpoints";
import axios from "../axios";

export const createUser = async (userData: FormData) => {
    try {
        const response = await axios.post(
            API.ADMIN.USERS.CREATE,
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Create user failed');
    }
}

export const getAllUsers = async (page: string = '1', size: string = '10', search?: string) => {
    try {
        const response = await axios.get(API.ADMIN.USERS.GET_ALL, {
            params: { page, size, search }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch users');
    }
}

export const getUserById = async (id: string) => {
    try {
        const response = await axios.get(`${API.ADMIN.USERS.GET_ONE}${id}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user');
    }
}

export const updateUser = async (id: string, userData: FormData) => {
    try {
        const response = await axios.put(
            `${API.ADMIN.USERS.UPDATE}${id}`,
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Update user failed');
    }
}

export const deleteUser = async (id: string) => {
    try {
        const response = await axios.delete(`${API.ADMIN.USERS.DELETE}${id}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Delete user failed');
    }
}

