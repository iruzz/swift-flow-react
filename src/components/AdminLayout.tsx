import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold text-blue-600">SIPINTER Admin</div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-blue-50">📊 Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/users" className="block px-4 py-2 hover:bg-blue-50">👥 Users</Link>
            </li>
            <li>
              <Link to="/admin/companies" className="block px-4 py-2 hover:bg-blue-50">🏢 Companies</Link>
            </li>
            <li>
              <Link to="/admin/students" className="block px-4 py-2 hover:bg-blue-50">🎓 Students</Link>
            </li>
            <li>
              <Link to="/admin/settings" className="block px-4 py-2 hover:bg-blue-50">⚙️ Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
