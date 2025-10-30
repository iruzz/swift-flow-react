import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Users from "./pages/admin/Users";

// Dashboard per role
import SiswaDashboard from "./pages/siswa/Dashboard";
import SiswaProfile from "./pages/siswa/Profile";
import PerusahaanProfile from "./pages/perusahaan/Profile";
import AdminLowongan from "./pages/admin/AdminLowonganMagang"
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPenempatan from "./pages/admin/Penempatan";
import AdminLamaran from "./pages/admin/AdminLamaranMagang";
import PerusahaanDashboard from "./pages/perusahaan/Dashboard";
import GuruDashboard from "./pages/guru/Dashboard";
import AdminPenilaian from "./pages/admin/Penilaian";
import SiswaProfiles from "./pages/admin/SiswaProfiles";
import PerusahaanProfiles from "./pages/admin/PerusahaanProfiles";

// ✅ IMPORT COMPONENT BARU UNTUK SISWA
import LowonganList from "./pages/siswa/LowonganList";
import LamaranList from "./pages/siswa/LamaranList";
import MagangList from "./pages/siswa/MagangList";
// ✅ IMPORT LOWONGAN & LAMARAN DETAIL BARU
import LowonganDetail from "./pages/siswa/LowonganDetail";
import LamaranDetail from "./pages/siswa/LamaranDetail";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          
          {/* ✅ SISWA ROUTES */}
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
          {/* ✅ ROUTE BARU UNTUK SISWA */}
          <Route
            path="/siswa/lowongan"
            element={
              <ProtectedRoute allowedRoles={["siswa"]}>
                <LowonganList />
              </ProtectedRoute>
            }
          />
          {/* ✅ TAMBAH ROUTE LOWONGAN DETAIL DI SINI */}
          <Route
            path="/siswa/lowongan/:id"
            element={
              <ProtectedRoute allowedRoles={["siswa"]}>
                <LowonganDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/siswa/lamaran"
            element={
              <ProtectedRoute allowedRoles={["siswa"]}>
                <LamaranList />
              </ProtectedRoute>
            }

          />
          <Route
           path="/siswa/lamaran/:id"
          element={
           <ProtectedRoute allowedRoles={["siswa"]}>
             <LamaranDetail />
    </ProtectedRoute>
  }
/>
          <Route
            path="/siswa/magang"
            element={
              <ProtectedRoute allowedRoles={["siswa"]}>
                <MagangList />
               </ProtectedRoute>
           }
          />

          {/* ADMIN ROUTES */}
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
            path="/admin/penilaian"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPenilaian />
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
            path="/admin/penempatan"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPenempatan />
              </ProtectedRoute>
            }
          />

          {/* PERUSAHAAN ROUTES */}
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

          {/* GURU ROUTES */}
          <Route
            path="/guru/dashboard"
            element={
              <ProtectedRoute allowedRoles={["guru"]}>
                <GuruDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;