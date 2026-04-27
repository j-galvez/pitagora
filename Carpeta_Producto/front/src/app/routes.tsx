import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { CreateTicket } from "./pages/CreateTicket";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminCreateTicket } from "./pages/AdminCreateTicket";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/crear-ticket",
    element: <CreateTicket />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/crear-ticket",
    element: <AdminCreateTicket />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
