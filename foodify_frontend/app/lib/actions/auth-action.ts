// // "use server";

// // import { login, register } from "../api/auth";
// // import { LoginData, RegisterData } from "@/app/(auth)/schema";
// // import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
// // import { redirect } from "next/navigation";

// // export const handleRegister = async (data: RegisterData) => {
// //     try {
// //         const response = await register(data);
// //         if (response.success) {
// //             return {
// //                 success: true,
// //                 message: 'Registration successful',
// //                 data: response.data
// //             };
// //         }
// //         return {
// //             success: false,
// //             message: response.message || 'Registration failed'
// //         };
// //     } catch (error: Error | any) {
// //         return { success: false, message: error.message || 'Registration action failed' };
// //     }
// // };

// // export const handleLogin = async (data: LoginData) => {
// //     try {
// //         const response = await login(data);
// //         if (response.success) {
// //             await setAuthToken(response.token);
// //             await setUserData(response.data);
// //             return {
// //                 success: true,
// //                 message: 'Login successful',
// //                 data: response.data
// //             };
// //         }
// //         return {
// //             success: false,
// //             message: response.message || 'Login failed'
// //         };
// //     } catch (error: Error | any) {
// //         return { success: false, message: error.message || 'Login action failed' };
// //     }
// // };

// // export const handleLogout = async () => {
// //     await clearAuthCookies();
// //     return redirect('/login');
// // };

// "use server";

// import { login, register } from "../api/auth";
// import { LoginData, RegisterData } from "@/app/(auth)/schema";
// import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
// import { redirect } from "next/navigation";

// export const handleRegister = async (data: RegisterData) => {
//     try {
//         const response = await register(data);
//         console.log("📝 Register response:", response); // Debug

//         if (response.success) {
//             return {
//                 success: true,
//                 message: 'Registration successful',
//                 data: response.data
//             };
//         }
//         return {
//             success: false,
//             message: response.message || 'Registration failed'
//         };
//     } catch (error: Error | any) {
//         console.error("❌ Register error:", error); // Debug
//         return { success: false, message: error.message || 'Registration action failed' };
//     }
// };

// export const handleLogin = async (data: LoginData) => {
//     try {
//         console.log("🔑 Calling login API..."); // Debug
//         const response = await login(data);
//         console.log("📦 API response:", response); // Debug

//         if (response.success && response.token && response.data) {
//             console.log("💾 Setting cookies..."); // Debug
//             await setAuthToken(response.token);
//             await setUserData(response.data);
//             console.log("✅ Cookies set successfully"); // Debug

//             return {
//                 success: true,
//                 message: 'Login successful',
//                 data: response.data
//             };
//         }

//         console.log("⚠️ Login response missing token or data"); // Debug
//         return {
//             success: false,
//             message: response.message || 'Login failed'
//         };
//     } catch (error: Error | any) {
//         console.error("🔴 Login action error:", error); // Debug
//         return { success: false, message: error.message || 'Login action failed' };
//     }
// };

// export const handleLogout = async () => {
//     await clearAuthCookies();
//     redirect('/login');
// };

"use server";

import { login, register } from "../api/auth";
import { LoginData, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";

export const handleRegister = async (data: RegisterData) => {
    try {
        const response = await register(data);
        console.log("📝 Register response:", response);

        if (response.success) {
            return {
                success: true,
                message: 'Registration successful',
                data: response.user  // ← Changed from response.data to response.user
            };
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        };
    } catch (error: Error | any) {
        console.error("❌ Register error:", error);
        return { success: false, message: error.message || 'Registration action failed' };
    }
};

export const handleLogin = async (data: LoginData) => {
    try {
        console.log("🔑 Calling login API...");
        const response = await login(data);
        console.log("📦 API response:", response);

        // Changed: Check for response.user instead of response.data
        if (response.success && response.token && response.user) {
            console.log("💾 Setting cookies...");
            await setAuthToken(response.token);
            await setUserData(response.user);  // ← Changed from response.data to response.user
            console.log("✅ Cookies set successfully");

            return {
                success: true,
                message: 'Login successful',
                data: response.user  // ← Changed from response.data to response.user
            };
        }

        console.log("⚠️ Login response missing token or user");
        return {
            success: false,
            message: response.message || 'Login failed'
        };
    } catch (error: Error | any) {
        console.error("🔴 Login action error:", error);
        return { success: false, message: error.message || 'Login action failed' };
    }
};

export const handleLogout = async () => {
    await clearAuthCookies();
    redirect('/login');
};