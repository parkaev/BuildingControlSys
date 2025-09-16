import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {StrictMode} from "react";
import App from './App.tsx'
import Home from './app/pages/Home.tsx';
import Auth from "./app/pages/Auth.tsx";
import Requests from "./app/pages/Requests.tsx";
import Report from "./app/pages/Report.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "/requests",
                element: <Requests />
            },
            {
                path: "/report",
                element: <Report />
            },
        ]
    },
    {
        path: "/auth",
        element: <Auth />
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
