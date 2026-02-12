export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        PROFILE: '/api/auth/profile',
        UPDATE_PROFILE: '/api/auth/',
        // ✅ ADD THESE
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    ADMIN: {
        USERS: {
            CREATE: '/api/admin/users',
            GET_ALL: '/api/admin/users',
            GET_ONE: '/api/admin/users/',
            UPDATE: '/api/admin/users/',
            DELETE: '/api/admin/users/',
        }
    }
}