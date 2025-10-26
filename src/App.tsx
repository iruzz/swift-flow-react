import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Users from "./pages/admin/Users"; // ← IMPORT INI

// Dashboard per role
import SiswaDashboard from "./pages/siswa/Dashboard";
import SiswaProfile from "./pages/siswa/Profile";
import PerusahaanProfile from "./pages/perusahaan/Profile";
import AdminLowongan from "./pages/admin/AdminLowonganMagang"
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLamaran from "./pages/admin/AdminLamaranMagang";
import PerusahaanDashboard from "./pages/perusahaan/Dashboard";
import GuruDashboard from "./pages/guru/Dashboard";
import SiswaProfiles from "./pages/admin/SiswaProfiles";
import PerusahaanProfiles from "./pages/admin/PerusahaanProfiles";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected */}
          {/* Siswa Routes */}
<Route
  path="/siswa/dashboard"
  element={
    <ProtectedRoute allowedRoles={["siswa"]}>
      <SiswaDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/siswa/profile"
  element={
    <ProtectedRoute allowedRoles={["siswa"]}>
      <SiswaProfile />
    </ProtectedRoute>
  }
/>
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

            <Route
     path="/admin/siswa-profiles"
     element={
       <ProtectedRoute allowedRoles={["admin"]}>
         <SiswaProfiles />
       </ProtectedRoute>
     }
   />

             <Route
     path="/admin/perusahaan-profiles"
     element={
       <ProtectedRoute allowedRoles={["admin"]}>
         <PerusahaanProfiles />
       </ProtectedRoute>
     }
   />

          <Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Users />
    </ProtectedRoute>
  }
/>

      <Route
            path="/admin/lowongan"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLowongan />
              </ProtectedRoute>
            }
          />

             <Route
            path="/admin/lamaran"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLamaran />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perusahaan/dashboard"
            element={
              <ProtectedRoute allowedRoles={["perusahaan"]}>
                <PerusahaanDashboard />
              </ProtectedRoute>
            }
          />

            <Route
            path="/perusahaan/profile"
            element={
              <ProtectedRoute allowedRoles={["perusahaan"]}>
                <PerusahaanProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guru/dashboard"
            element={
              <ProtectedRoute allowedRoles={["guru"]}>
                <GuruDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
