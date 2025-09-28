"use client";

import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

function Header() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const hasAccess = (roles: string[]) => {
        if (!user) return false;
        return roles.includes(user.role) || user.role === "admin";
    };

    return (
        <header className="w-full max-h-[80px] flex flex-row gap-2 py-[10px]">
            {/* Логотип */}
            <NavLink to={"/"}>
                <div className="flex items-center p-2 bg-backgroundSecond rounded-[50px] w-[225px] h-[60px] border-2 border-accentSecond">
                    <img
                        src="/svgs/DM_logo.svg"
                        alt="Логотип"
                        className="w-full h-full object-contain"
                    />
                </div>
            </NavLink>

            {/* Основное меню и профиль */}
            <div className="flex flex-row justify-between p-4 bg-backgroundSecond rounded-[50px] w-full h-[60px] border-2 border-accentSecond">
                {/* Навигация */}
                <div className="flex flex-row items-center gap-4 text-[20px]">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "border-b-2 border-accentThird"
                                : "hover:text-black ease-in-out"
                        }
                    >
                        Дашборд
                    </NavLink>

                    {hasAccess(["user"]) && (
                        <NavLink
                            to="/report"
                            className={({ isActive }) =>
                                isActive
                                    ? "border-b-2 border-accentThird"
                                    : "hover:text-black ease-in-out"
                            }
                        >
                            Отчет
                        </NavLink>
                    )}

                    {hasAccess(["manager"]) && (
                        <NavLink
                            to="/requests"
                            className={({ isActive }) =>
                                isActive
                                    ? "border-b-2 border-accentThird"
                                    : "hover:text-black ease-in-out"
                            }
                        >
                            Заявки
                        </NavLink>
                    )}

                    {hasAccess(["manager"]) && (
                        <NavLink
                            to="/projects"
                            className={({ isActive }) =>
                                isActive
                                    ? "border-b-2 border-accentThird"
                                    : "hover:text-black ease-in-out"
                            }
                        >
                            Проекты
                        </NavLink>
                    )}

                    {hasAccess(["boss"]) && (
                        <NavLink
                            to="/statistics"
                            className={({ isActive }) =>
                                isActive
                                    ? "border-b-2 border-accentThird"
                                    : "hover:text-black ease-in-out"
                            }
                        >
                            Отчетность
                        </NavLink>
                    )}
                </div>

                {/* Правый блок: админ/профиль */}
                <div className="flex flex-row gap-4 items-center relative">
                    {/* Ссылка для администратора */}
                    {hasAccess(["admin"]) && (
                        <>
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    isActive
                                        ? "border-b-2 border-accentThird"
                                        : "hover:text-black ease-in-out"
                                }
                            >
                                Админ
                            </NavLink>

                            {/* Разделитель */}
                            <img
                                src="/svgs/hr.svg"
                                alt="Разделитель"
                                className="h-[90%] object-contain"
                            />
                        </>
                    )}

                    {/* Инфо о пользователе */}
                    {user ? (
                        <div className="flex flex-col text-center justify-evenly">
                            <div>{user.username}</div>
                        </div>
                    ) : (
                        <div className="text-gray-500">Гость</div>
                    )}

                    {/* Аватар + меню */}
                    <div className="relative">
                        <div
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex justify-center items-center bg-accentSecond rounded-full w-10 h-10 cursor-pointer"
                        >
                            <img
                                src="/svgs/user_logo.svg"
                                alt="Профиль"
                                className="w-6 h-6 object-contain"
                            />
                        </div>

                        {/* Выпадающее меню */}
                        {menuOpen && (
                            <div className="absolute right-0 p-1 bg-backgroundSecond border-2 border-accentSecond rounded-[50px] shadow-lg z-10">
                                <button
                                    onClick={logout}
                                    className=""
                                >
                                    <div className="w-full px-4 py-2 text-left text-red-500">
                                        Выйти
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
