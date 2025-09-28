import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { API_URL } from "../config.ts";

type User = {
    username: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Проверка токена и получение текущего пользователя
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Не авторизован");

            const data = await response.json();
            setUser(data);
        } catch (err) {
            setUser(null);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для использования контекста
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
