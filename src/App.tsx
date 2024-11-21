import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegularLayout from "./components/RegularLayout/RegularLayout";
import HomePage from "./components/RegularLayout/components/HomePage/HomePage";
import { LoginPage } from "./components/RegularLayout/components/LoginPage/LoginPage";
import { SignUpPage } from "./components/RegularLayout/components/SignUpPage/SignUpPage";
import { AdminLogin } from "./components/RegularLayout/components/AdminLogin/AdminLogin";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import AdminCustomerView from "./components/AdminLayout/AdminCustomerView/AdminCustomerView";
import AdminVehicleView from "./components/AdminLayout/AdminVehicleView/AdminVehicleView";
import AdminReservationView from "./components/AdminLayout/AdminReservationView/AdminReservationView";
import AdminInvoiceView from "./components/AdminLayout/AdminInvoiceView/AdminInvoiceView";
import AdminAnalytics from "./components/AdminLayout/AdminAnalytics/AdminAnalytics";

const routes = [
  {
    element: <RegularLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "admin/login",
        element: <AdminLogin />,
      },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/home",
        element: <HomePage />,
      },
      {
        path: "/admin/customers",
        element: <AdminCustomerView />,
      },
      {
        path: "/admin/vehicles",
        element: <AdminVehicleView />,
      },
      {
        path: "/admin/reservation",
        element: <AdminReservationView />,
      },
      {
        path: "/admin/invoice",
        element: <AdminInvoiceView />,
      },
      {
        path: "/admin/analytics",
        element: <AdminAnalytics />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
