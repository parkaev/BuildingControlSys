import type {ReactNode} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Props = {
    children: ReactNode;
    roles?: string[]; // если роли указаны, проверяем доступ
};

export const ProtectedRoute = ({ children, roles }: Props) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Загрузка...</div>; // можно поставить спиннер

    if (!user) return <Navigate to="/auth" />; // не залогинен

    if (roles && !roles.includes(user.role)) return <Navigate to="/" />; // нет прав

    return <>{children}</>;
};
