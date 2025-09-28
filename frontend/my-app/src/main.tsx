import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import App from "./App.tsx";
import Home from "./app/pages/Home.tsx";
import Auth from "./app/pages/Auth.tsx";
import Requests from "./app/pages/Requests.tsx";
import Report from "./app/pages/Report.tsx";
import Projects from "./app/pages/Projects.tsx";
import Statistics from "./app/pages/Statistics.tsx";
import Admin from "./app/pages/Admin.tsx";

import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
        children: [
            { path: "", element: (<ProtectedRoute roles={["user"]}><Home /></ProtectedRoute>) },
            { path: "report", element: (<ProtectedRoute roles={["user"]}><Report /></ProtectedRoute>) },
            { path: "requests", element: (<ProtectedRoute roles={["manager"]}><Requests /></ProtectedRoute>) },
            { path: "projects", element: (<ProtectedRoute roles={["manager"]}><Projects /></ProtectedRoute>) },
            { path: "statistics", element: (<ProtectedRoute roles={["boss"]}><Statistics /></ProtectedRoute>) },
            { path: "admin", element: (<ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>) },
        ],
    },
    { path: "/auth", element: <Auth /> },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
