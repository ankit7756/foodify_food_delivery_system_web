"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clearAuthCookies, getAuthToken } from "@/lib/cookie";
import { useRouter } from "next/navigation";
import api from "@/lib/api/axios";

export interface UserProfile {
    id: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    profileImage: string | null;
    role: string;
    createdAt: string;
}

interface AuthContextProps {
    // Original auth state (keep for backward compat)
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    loading: boolean;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;

    // Full profile (new — replaces bare `user` any type)
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
    refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch full profile from API (includes profileImage URL)
    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/auth/profile");
            if (res.data.success) {
                setUser(res.data.data);
                setIsAuthenticated(true);
            }
        } catch {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const checkAuth = async () => {
        try {
            const token = await getAuthToken();
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }
            setIsAuthenticated(true);
            // Also fetch full profile so we have profileImage etc.
            await fetchProfile();
        } catch {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await clearAuthCookies();
            setIsAuthenticated(false);
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser,
            loading,
            logout,
            checkAuth,
            refetchProfile: fetchProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};