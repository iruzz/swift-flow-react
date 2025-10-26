import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  Home, 
  Users, 
  Menu, 
  User, 
  Briefcase, 
  FileText, 
  Building2,
  GraduationCap,
  ClipboardList,
  Award,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  role: string;
  onToggle?: (collapsed: boolean) => void;
}

const Sidebar = ({ role, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const adminMenus = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={20} /> },
    { name: "Kelola Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Kelola Siswa", path: "/admin/siswa-profiles", icon: <GraduationCap size={20} /> },
    { name: "Kelola Perusahaan", path: "/admin/perusahaan-profiles", icon: <Building2 size={20} /> },
    { name: "Lowongan Magang", path: "/admin/lowongan", icon: <Briefcase size={20} /> },
    { name: "Lamaran", path: "/admin/lamaran", icon: <FileText size={20} /> },
    { name: "Penempatan", path: "/admin/penempatan", icon: <ClipboardList size={20} /> },
    { name: "Laporan", path: "/admin/laporan", icon: <BarChart3 size={20} /> },
  ];

  const siswaMenus = [
    { name: "Dashboard", path: "/siswa/dashboard", icon: <Home size={20} /> },
    { name: "Profile", path: "/siswa/profile", icon: <User size={20} /> },
    { name: "Cari Lowongan", path: "/siswa/lowongan", icon: <Briefcase size={20} /> },
    { name: "Lamaran Saya", path: "/siswa/lamaran", icon: <FileText size={20} /> },
    { name: "Magang Saya", path: "/siswa/magang", icon: <ClipboardList size={20} /> },
  ];

  const perusahaanMenus = [
    { name: "Dashboard", path: "/perusahaan/dashboard", icon: <Home size={20} /> },
    { name: "Profile Perusahaan", path: "/perusahaan/profile", icon: <Building2 size={20} /> },
    { name: "Lowongan Saya", path: "/perusahaan/lowongan", icon: <Briefcase size={20} /> },
    { name: "Pelamar", path: "/perusahaan/pelamar", icon: <Users size={20} /> },
    { name: "Siswa Magang", path: "/perusahaan/siswa-magang", icon: <GraduationCap size={20} /> },
    { name: "Penilaian", path: "/perusahaan/penilaian", icon: <Award size={20} /> },
  ];

  const guruMenus = [
    { name: "Dashboard", path: "/guru/dashboard", icon: <Home size={20} /> },
    { name: "Profile", path: "/guru/profile", icon: <User size={20} /> },
    { name: "Siswa Bimbingan", path: "/guru/siswa", icon: <GraduationCap size={20} /> },
    { name: "Monitoring Magang", path: "/guru/monitoring", icon: <ClipboardList size={20} /> },
    { name: "Penilaian", path: "/guru/penilaian", icon: <Award size={20} /> },
    { name: "Laporan", path: "/guru/laporan", icon: <BarChart3 size={20} /> },
  ];

  const getMenus = () => {
    switch (role) {
      case "admin":
        return adminMenus;
      case "siswa":
        return siswaMenus;
      case "perusahaan":
        return perusahaanMenus;
      case "guru":
        return guruMenus;
      default:
        return [];
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "siswa":
        return "Siswa";
      case "perusahaan":
        return "Perusahaan";
      case "guru":
        return "Guru Pembimbing";
      default:
        return role;
    }
  };

  const menus = getMenus();

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onToggle?.(newState);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen ${
        collapsed ? "w-20" : "w-64"
      } bg-white/70 backdrop-blur-xl border-r border-gray-200 shadow-md transition-all duration-300 flex flex-col z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
              SIPINTER
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">SMK Dicoding</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-blue-500 transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Role info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
          <p className="text-sm font-medium text-gray-700">{getRoleLabel()}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-3 px-2">
        {menus.map((menu) => {
          const active = location.pathname === menu.path;
          return (
            <Link
              key={menu.path}
              to={menu.path}
              title={collapsed ? menu.name : undefined}
              className={`flex items-center gap-3 px-4 py-3 my-1 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className={collapsed ? "mx-auto" : ""}>
                {menu.icon}
              </span>
              {!collapsed && <span className="text-sm font-medium">{menu.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100 text-xs text-gray-500 text-center">
          <p>© 2025 SMK Dicoding</p>
          <p className="text-[10px] text-gray-400 mt-1">SIPINTER v1.0</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;