import './app/globals.css'
import {Outlet} from "react-router-dom";
import Header from './compoents/Header.tsx';

function App() {
    return (
        <div className="container">
            <Header/>
            <div className="min-h-screen">
                <Outlet/>
            </div>
        </div>
    )
}

export default App
