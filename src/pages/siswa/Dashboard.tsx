import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Sidebar";

interface Stats {
  totalLamaran: number;
  lamaranDiterima: number;
  lamaranPending: number;
  sedangMagang: boolean;
}

interface ProfileStatus {
  hasProfile: boolean;
  isVerified: boolean;
  statusVerifikasi: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalLamaran: 0,
    lamaranDiterima: 0,
    lamaranPending: 0,
    sedangMagang: false,
  });
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>({
    hasProfile: false,
    isVerified: false,
    statusVerifikasi: "pending",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Cek profile siswa
      try {
        const profileRes = await axios.get(
          "http://localhost:8000/api/siswa/profile"
        );
        if (profileRes.data.success) {
          setProfileStatus({
            hasProfile: true,
            isVerified: profileRes.data.data.status_verifikasi === "approved",
            statusVerifikasi: profileRes.data.data.status_verifikasi,
          });
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setProfileStatus({
            hasProfile: false,
            isVerified: false,
            statusVerifikasi: "pending",
          });
        }
      }

      // TODO: Fetch stats lamaran (nanti setelah bikin API lamaran)
      // const statsRes = await axios.get('http://localhost:8000/api/siswa/stats');
      // setStats(statsRes.data.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="siswa" />

      {/* Main Content - Tambah margin left sesuai lebar sidebar */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Siswa
            </h1>
            <p className="text-gray-600 mt-1">
              Selamat datang, {user?.name}! 👋
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Alert jika belum lengkapi profile */}
        {!profileStatus.hasProfile && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Profile Belum Lengkap
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Lengkapi profile Anda untuk mulai melamar magang.
                </p>
                <button
                  onClick={() => navigate("/siswa/profile")}
                  className="mt-2 text-sm font-medium text-yellow-800 underline hover:text-yellow-900"
                >
                  Lengkapi Profile →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert jika profile belum verified */}
        {profileStatus.hasProfile && !profileStatus.isVerified && (
          <div
            className={`mb-6 border-l-4 p-4 rounded-lg ${
              profileStatus.statusVerifikasi === "rejected"
                ? "bg-red-50 border-red-400"
                : "bg-blue-50 border-blue-400"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {profileStatus.statusVerifikasi === "rejected" ? (
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3
                  className={`text-sm font-medium ${
                    profileStatus.statusVerifikasi === "rejected"
                      ? "text-red-800"
                      : "text-blue-800"
                  }`}
                >
                  {profileStatus.statusVerifikasi === "rejected"
                    ? "Profile Ditolak"
                    : "Profile Menunggu Verifikasi"}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    profileStatus.statusVerifikasi === "rejected"
                      ? "text-red-700"
                      : "text-blue-700"
                  }`}
                >
                  {profileStatus.statusVerifikasi === "rejected"
                    ? "Profile Anda ditolak oleh admin. Silakan perbaiki dan submit ulang."
                    : "Profile Anda sedang dalam proses verifikasi oleh admin."}
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Lamaran
                    </p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {stats.totalLamaran}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Diterima
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {stats.lamaranDiterima}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {stats.lamaranPending}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <svg
                      className="w-8 h-8 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Status Magang
                    </p>
                    <p className="text-lg font-bold text-purple-600 mt-2">
                      {stats.sedangMagang ? "Aktif" : "Tidak Aktif"}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Menu Cepat
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate("/siswa/profile")}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    👤
                  </div>
                  <p className="font-medium text-gray-900">Profile Saya</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Kelola informasi pribadi
                  </p>
                </button>

                <button
                  onClick={() => navigate("/siswa/lowongan")}
                  className={`p-4 border-2 rounded-lg transition-all text-left group ${
                    profileStatus.isVerified
                      ? "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                  }`}
                  disabled={!profileStatus.isVerified}
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    📋
                  </div>
                  <p className="font-medium text-gray-900">Cari Lowongan</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Lihat lowongan magang tersedia
                  </p>
                  {!profileStatus.isVerified && (
                    <span className="text-xs text-red-500 mt-1 block">
                      Profile harus verified
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate("/siswa/lamaran")}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    📄
                  </div>
                  <p className="font-medium text-gray-900">Lamaran Saya</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Track status lamaran
                  </p>
                </button>

                <button
                  onClick={() => navigate("/siswa/magang")}
                  className={`p-4 border-2 rounded-lg transition-all text-left group ${
                    stats.sedangMagang
                      ? "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                  }`}
                  disabled={!stats.sedangMagang}
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <p className="font-medium text-gray-900">Laporan Magang</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Submit laporan mingguan
                  </p>
                  {!stats.sedangMagang && (
                    <span className="text-xs text-red-500 mt-1 block">
                      Belum ada magang aktif
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Aktivitas Terbaru
              </h2>
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>Belum ada aktivitas</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;