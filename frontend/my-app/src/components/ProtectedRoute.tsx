import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Props = {
    children: ReactNode;
    roles?: string[]; // роли, которым разрешен доступ
};

export const ProtectedRoute = ({ children, roles }: Props) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Загрузка...</div>; // можно заменить на спиннер

    // если не авторизован → редирект
    if (!user) return <Navigate to="/auth" replace />;

    // если есть список ролей и роль пользователя туда не входит
    // но при этом он не admin → редирект
    if (roles && !roles.includes(user.role) && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
