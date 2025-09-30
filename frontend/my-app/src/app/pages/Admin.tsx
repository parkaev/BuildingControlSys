import {useEffect, useState} from "react";
import api from "../../config/api.ts"; // <-- путь к твоему axios/fetch-конфигу

type User = {
    id: number;
    username: string;
    role: string;
    is_active: boolean;
};

export default function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newUser, setNewUser] = useState({
        username: "",
        password: "",
        role: "user",
    });

    // Получить список пользователей
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get<User[]>("/admin/users");
            setUsers(res.data);
        } catch (err: any) {
            setError("Ошибка при загрузке пользователей");
        } finally {
            setLoading(false);
        }
    };

    // Создать пользователя
    const createUser = async () => {
        try {
            await api.post("/admin/users", newUser);
            setNewUser({username: "", password: "", role: "user"});
            fetchUsers();
        } catch (err) {
            alert("Ошибка при создании пользователя");
        }
    };

    // Обновить пользователя
    const updateUser = async (u: User) => {
        try {
            await api.put(`/admin/users/${u.id}`, u);
            fetchUsers();
        } catch {
            alert("Ошибка при обновлении пользователя");
        }
    };

    // Удалить пользователя
    const deleteUser = async (id: number) => {
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch {
            alert("Ошибка при удалении пользователя");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-col">
            {/*<h1 className="text-3xl font-bold mb-6 text-accentThird">Админ-панель</h1>*/}

            {/* Блок создания пользователя */}
            <div className="mb-[10px] p-6 bg-backgroundSecond border-2 border-accentSecond rounded-[30px]">
                <h2 className="text-xl font-semibold mb-4">Создать пользователя</h2>
                <div className="flex flex-wrap gap-3">
                    <input
                        className="border-2 border-accentSecond rounded-md p-2 flex-1"
                        type="text"
                        placeholder="Логин"
                        value={newUser.username}
                        onChange={(e) =>
                            setNewUser({...newUser, username: e.target.value})
                        }
                    />
                    <input
                        className="border-2 border-accentSecond rounded-md p-2 flex-1"
                        type="password"
                        placeholder="Пароль"
                        value={newUser.password}
                        onChange={(e) =>
                            setNewUser({...newUser, password: e.target.value})
                        }
                    />
                    <select
                        className="border-2 border-accentSecond rounded-md p-2"
                        value={newUser.role}
                        onChange={(e) =>
                            setNewUser({...newUser, role: e.target.value})
                        }
                    >
                        <option value="user">user</option>
                        <option value="manager">manager</option>
                        <option value="boss">boss</option>
                        <option value="admin">admin</option>
                    </select>
                    <button
                        onClick={createUser}
                        className="bg-accentSecond text-white px-6 py-2 rounded-[20px] hover:opacity-90"
                    >
                        Добавить
                    </button>
                </div>
            </div>

            {/* Таблица пользователей */}
            <div className="overflow-x-auto">
                <table className="w-full border-2 border-accentSecond rounded-[30px] overflow-hidden">
                    <thead className="bg-backgroundSecond">
                    <tr>
                        <th className="border-2 border-accentSecond p-3">ID</th>
                        <th className="border-2 border-accentSecond p-3">Логин</th>
                        <th className="border-2 border-accentSecond p-3">Роль</th>
                        <th className="border-2 border-accentSecond p-3">Активен</th>
                        <th className="border-2 border-accentSecond p-3">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="text-center">
                            <td className="border-2 border-accentSecond p-2">{u.id}</td>
                            <td className="border-2 border-accentSecond p-2">
                                <input
                                    type="text"
                                    className="border-2 border-accentSecond rounded-md p-1 w-full"
                                    value={u.username}
                                    onChange={(e) =>
                                        setUsers((prev) =>
                                            prev.map((x) =>
                                                x.id === u.id
                                                    ? {...x, username: e.target.value}
                                                    : x
                                            )
                                        )
                                    }
                                />
                            </td>
                            <td className="border-2 border-accentSecond p-2">
                                <select
                                    className="border-2 border-accentSecond rounded-md p-1"
                                    value={u.role}
                                    onChange={(e) =>
                                        setUsers((prev) =>
                                            prev.map((x) =>
                                                x.id === u.id
                                                    ? {...x, role: e.target.value}
                                                    : x
                                            )
                                        )
                                    }
                                >
                                    <option value="user">user</option>
                                    <option value="manager">manager</option>
                                    <option value="boss">boss</option>
                                    <option value="admin">admin</option>
                                </select>
                            </td>
                            <td className="border-2 border-accentSecond p-2">
                                <input
                                    type="checkbox"
                                    checked={u.is_active}
                                    onChange={(e) =>
                                        setUsers((prev) =>
                                            prev.map((x) =>
                                                x.id === u.id
                                                    ? {...x, is_active: e.target.checked}
                                                    : x
                                            )
                                        )
                                    }
                                />
                            </td>
                            <td className="border-2 border-accentSecond p-2 flex gap-2 justify-center">
                                <button
                                    onClick={() => updateUser(u)}
                                    className="bg-accentThird text-white px-4 py-1 rounded-[15px] hover:opacity-90"
                                >
                                    Сохранить
                                </button>
                                <button
                                    onClick={() => deleteUser(u.id)}
                                    className="bg-red-500 text-white px-4 py-1 rounded-[15px] hover:opacity-90"
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
