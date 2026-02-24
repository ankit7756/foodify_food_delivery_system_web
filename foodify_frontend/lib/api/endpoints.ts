export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        PROFILE: '/api/auth/profile',
        UPDATE_PROFILE: '/api/auth/',
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
    },
    FOODS: {
        GET_ALL: '/api/foods',
        GET_POPULAR: '/api/foods/popular',
        GET_BY_ID: (id: string) => `/api/foods/${id}`,
        GET_BY_RESTAURANT: (restaurantId: string) => `/api/foods/restaurant/${restaurantId}`,
    },
    RESTAURANTS: {
        GET_ALL: '/api/restaurants',
        GET_BY_ID: (id: string) => `/api/restaurants/${id}`,
        SEARCH: '/api/restaurants/search',
    },
    ORDERS: {
        CREATE: '/api/orders',
        GET_ALL: '/api/orders',
        CURRENT: '/api/orders/current',
        HISTORY: '/api/orders/history',
        GET_BY_ID: (id: string) => `/api/orders/${id}`,
        CONFIRM: (id: string) => `/api/orders/${id}/confirm`,
        CANCEL: (id: string) => `/api/orders/${id}/cancel`,
        UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
    },
    PAYMENT: {
        KHALTI_SEND_OTP: '/api/payment/khalti/send-otp',
        KHALTI_VERIFY_OTP: '/api/payment/khalti/verify-otp',
    },
    REVIEWS: {
        SUBMIT: (orderId: string) => `/api/reviews/order/${orderId}`,
        GET_BY_ORDER: (orderId: string) => `/api/reviews/order/${orderId}`,
        MY_REVIEWS: '/api/reviews/my',
        RESTAURANT: (restaurantId: string) => `/api/reviews/restaurant/${restaurantId}`,
    },
}