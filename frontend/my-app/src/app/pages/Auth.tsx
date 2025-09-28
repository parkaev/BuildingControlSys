import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // путь проверь

export default function Auth() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user, login } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        setError("");

        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: username,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error("Неверный логин или пароль");
            }

            const data = await response.json();

            // вместо прямого localStorage — используем login из контекста
            login(data.access_token);
        } catch (err: any) {
            setError(err.message || "Ошибка авторизации");
        }
    };

    return (
        <div className="h-screen flex justify-center">
            <div className="flex flex-col gap-2 m-auto max-w-lg p-16 bg-backgroundSecond rounded-md border-2 border-accentSecond">
                <NavLink
                    to={"/"}
                    className="m-auto flex justify-center bg-backgroundFirst rounded-full aspect-square border-2 border-accentSecond w-[100px]"
                >
                    <img
                        className="object-contain"
                        src="/svgs/Logo_B&W.svg"
                        alt="Логотип"
                    />
                </NavLink>
                <div className="text-black text-2xl text-center">
                    Defect Manager
                </div>

                {error && (
                    <div className="text-red-500 text-center">{error}</div>
                )}

                <div className="text-[16px] text-accentThird pl-1">
                    Логин / Почта
                </div>
                <input
                    className="border-2 border-accentSecond rounded-md p-2"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <div className="text-[16px] text-accentThird pl-1">
                    Пароль
                </div>
                <input
                    className="border-2 border-accentSecond rounded-md p-2"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="bg-accentSecond rounded-md p-2"
                >
                    Войти
                </button>
            </div>
        </div>
    );
}
