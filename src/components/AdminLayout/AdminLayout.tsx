import { AdminNavbar } from "./AdminNavbar/AdminNavbar";
import Footer from "../RegularLayout/components/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <main style={{ display: "flex" }}>
        <AdminNavbar />
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
