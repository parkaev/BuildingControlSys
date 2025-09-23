'use client'

import { NavLink } from "react-router-dom";

function Header() {
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
                        Главная
                    </NavLink>
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
                </div>

                {/* Правый блок: уведомления, разделитель, профиль */}
                <div className="flex flex-row gap-4 items-center">
                    {/* Уведомления */}
                    <div className="flex justify-center items-center bg-accentSecond rounded-full w-7 h-7">
                        <img
                            src="/svgs/notification_bell.svg"
                            alt="Уведомления"
                            className="w-4 h-4 object-contain"
                        />
                    </div>

                    {/* Разделитель */}
                    <img
                        src="/svgs/hr.svg"
                        alt="Разделитель"
                        className="h-[90%] object-contain"
                    />

                    {/* Инфо о пользователе */}
                    <div className="flex flex-col text-center justify-evenly">
                        <div>Username</div>
                        <div className="text-[16px]">mail@example.com</div>
                    </div>

                    {/* Аватар */}
                    <div className="flex justify-center items-center bg-accentSecond rounded-full w-10 h-10">
                        <img
                            src="/svgs/user_logo.svg"
                            alt="Профиль"
                            className="w-6 h-6 object-contain"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
