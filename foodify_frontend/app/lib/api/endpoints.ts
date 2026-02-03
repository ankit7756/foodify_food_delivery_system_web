
// export const API = {
//     AUTH: {
//         LOGIN: '/api/auth/login',
//         REGISTER: '/api/auth/register',
//     }
// }

export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        PROFILE: '/api/auth/profile',
        UPDATE_PROFILE: '/api/auth/', // Will append :id
    },
    ADMIN: {
        USERS: {
            CREATE: '/api/admin/users',
            GET_ALL: '/api/admin/users',
            GET_ONE: '/api/admin/users/', // Will append :id
            UPDATE: '/api/admin/users/', // Will append :id
            DELETE: '/api/admin/users/', // Will append :id
        }
    }
}