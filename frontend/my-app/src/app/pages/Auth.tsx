import {NavLink} from "react-router-dom";

export default function Auth() {
    return (
        <div className="h-screen flex justify-center">
            <div className="flex flex-col gap-2 m-auto max-w-lg p-16 bg-backgroundSecond rounded-md border-2 border-accentSecond">
                <NavLink to={"/"} className="m-auto flex justify-center bg-backgroundFirst rounded-full aspect-square border-2 border-accentSecond w-[100px]">
                    <img className="object-contain" src="/svgs/Logo_B&W.svg" alt="Логитип"/>
                </NavLink>
                <div className="text-black text-2xl text-center">Defect Manager</div>
                <div className="text-[16px] text-accentThird pl-1">Логин / Почта</div>
                <input className="border-2 border-accentSecond rounded-md p-2" type="text"/>
                <div className="text-[16px] text-accentThird pl-1">Пароль</div>
                <input className="border-2 border-accentSecond rounded-md p-2" type="password"/>
                <button className="bg-accentSecond rounded-md p-2">Войти</button>
            </div>
        </div>
    );
}
