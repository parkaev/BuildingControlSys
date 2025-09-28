import './app/globals.css'
import {Outlet} from "react-router-dom";
import Header from './components/Header.tsx';

function App() {
    return (
        <div className="container min-h-screen">
            <Header/>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}

export default App
