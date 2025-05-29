  import { createBrowserRouter } from "react-router-dom";

  import { getProjectById, getProjectsByUserId } from "./utils/project.js";

import Auth from "./pages/auth/Auth.jsx";
import Homepage from "./pages/home/Homepage.jsx";
import Projects from "./components/project/Projects.jsx";
import Project from "./components/project/Project.jsx";
import Root from "./pages/root/Root";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard.jsx"; // Importar el componente Dashboard
import PomodoroPage from "./pages/pomodoro/PomodoroPage.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/login",
        element: <Auth isRegister={false} />,
      },
      {
        path: "/register",
        element: <Auth isRegister={true} />,
      },
            {
        path: "/logout",
        element: <Homepage />,
      },
      {
        element: <Layout />,
        loader: async () => getProjectsByUserId(),
        shouldRevalidate: () => true,
        children: [
          {
            path: "/project/user",
            element: <Projects />,
            loader: async ({ params }) => getProjectsByUserId(params.id),
          },
          {
            path: "/project/:id",
            element: <Project />,
            loader: async ({ params }) => getProjectById(params.id),
          },
          {
            path: "/pomodoro",
            element: <PomodoroPage />,
            // Agregar un loader básico para verificar que la ruta se carga
            loader: async () => {
              console.log("Pomodoro route loaded");
              return null;
            },
          },
          {
            path: "/dashboard", // Nueva ruta para el dashboard
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);

  export default router;
