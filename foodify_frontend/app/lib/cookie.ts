// "use server"

// import { cookies } from "next/headers"

// interface UserData {
//     _id: string;        // Backend returns "_id"
//     email: string;
//     fullName: string;   // Changed from "name"
//     username: string;   // Added
//     phone: string;      // Added
//     role: string;
//     createdAt?: string;
//     updatedAt?: string;
//     [key: string]: any;
// }

// export const setAuthToken = async (token: string) => {
//     const cookieStore = await cookies();
//     cookieStore.set({
//         name: 'auth_token',
//         value: token,
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 60 * 60 * 24 * 7, // 7 days
//         path: '/',
//     })
// }

// export const getAuthToken = async () => {
//     const cookieStore = await cookies();
//     return cookieStore.get('auth_token')?.value || null;
// }

// export const setUserData = async (userData: UserData) => {
//     const cookieStore = await cookies();
//     cookieStore.set({
//         name: 'user_data',
//         value: JSON.stringify(userData),
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 60 * 60 * 24 * 7, // 7 days
//         path: '/',
//     })
// }

// export const getUserData = async (): Promise<UserData | null> => {
//     const cookieStore = await cookies();
//     const userData = cookieStore.get('user_data')?.value || null;
//     return userData ? JSON.parse(userData) : null;
// }

// export const clearAuthCookies = async () => {
//     const cookieStore = await cookies();
//     cookieStore.delete('auth_token');
//     cookieStore.delete('user_data');
// }

// // import { cookies } from 'next/headers';

// // export async function setAuthToken(token: string) {
// //     (await cookies()).set('token', token, {
// //         httpOnly: true,
// //         secure: process.env.NODE_ENV === 'production',
// //         sameSite: 'lax',
// //         maxAge: 60 * 60 * 24 * 7, // 7 days
// //     });
// // }

// // export async function setUserData(user: any) {
// //     (await cookies()).set('user', JSON.stringify(user), {
// //         httpOnly: true,
// //         secure: process.env.NODE_ENV === 'production',
// //         sameSite: 'lax',
// //         maxAge: 60 * 60 * 24 * 7,
// //     });
// // }

// // export async function getAuthToken() {
// //     const cookieStore = await cookies();
// //     return cookieStore.get('token')?.value;
// // }

// // export async function getUserData() {
// //     const cookieStore = await cookies();
// //     const userCookie = cookieStore.get('user')?.value;
// //     return userCookie ? JSON.parse(userCookie) : null;
// // }

// // export async function clearAuthCookies() {
// //     (await cookies()).delete('token');
// //     (await cookies()).delete('user');
// // }

"use server"

import { cookies } from "next/headers"

interface UserData {
    _id: string;
    email: string;
    fullName: string;
    username: string;
    phone: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
};

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, COOKIE_OPTIONS);
}

export const getAuthToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value || null;
}

export const setUserData = async (userData: UserData) => {
    const cookieStore = await cookies();
    cookieStore.set('user_data', JSON.stringify(userData), COOKIE_OPTIONS);
}

export const getUserData = async (): Promise<UserData | null> => {
    const cookieStore = await cookies();
    const userData = cookieStore.get('user_data')?.value || null;
    return userData ? JSON.parse(userData) : null;
}

export const clearAuthCookies = async () => {
    const cookieStore = await cookies();

    // Delete your cookie names
    cookieStore.delete('auth_token');
    cookieStore.delete('user_data');

    // Also delete any old variations (just in case)
    cookieStore.delete('token');
    cookieStore.delete('user');
}