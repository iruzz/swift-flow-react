import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Loader2 } from "lucide-react";

interface Stats {
  totalUsers: number;
  verifiedCompanies: number;
  registeredStudents: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/stats");
        console.log('Stats response:', res.data); // Debug log
        setStats(res.data.data);
        setError(null);
      } catch (err: any) {
        console.error("Gagal mengambil data:", err);
        setError(err.response?.data?.message || "Gagal mengambil data dari server");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content - Fixed margin */}
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
            Dashboard Admin
          </h1>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center mt-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="ml-3 text-gray-500">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center mt-20">
            <div className="text-center">
              <div className="bg-red-100 text-red-600 p-4 rounded-lg inline-block">
                <p className="font-medium">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - Total Users */}
            <div className="bg-white hover:shadow-xl shadow-md rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-100 transition-transform transform hover:-translate-y-1">
              <div className="p-4 bg-blue-100 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-700">
                Total Users
              </h2>
              <p className="text-4xl font-extrabold text-blue-600 mt-2">
                {stats.totalUsers}
              </p>
            </div>

            {/* Card 2 - Verified Companies */}
            <div className="bg-white hover:shadow-xl shadow-md rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-100 transition-transform transform hover:-translate-y-1">
              <div className="p-4 bg-green-100 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-700">
                Perusahaan Terverifikasi
              </h2>
              <p className="text-4xl font-extrabold text-green-600 mt-2">
                {stats.verifiedCompanies}
              </p>
            </div>

            {/* Card 3 - Registered Students */}
            <div className="bg-white hover:shadow-xl shadow-md rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-100 transition-transform transform hover:-translate-y-1">
              <div className="p-4 bg-purple-100 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-700">
                Siswa Terdaftar
              </h2>
              <p className="text-4xl font-extrabold text-purple-600 mt-2">
                {stats.registeredStudents}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center mt-20">
            <p className="text-red-600 font-medium text-lg">
              Data tidak tersedia
            </p>
          </div>
        )}

        {/* Quick Actions */}
        {stats && (
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => window.location.href = '/admin/users'}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  👥
                </div>
                <p className="font-medium text-gray-900">Kelola Users</p>
                <p className="text-sm text-gray-500 mt-1">
                  Manage all users
                </p>
              </button>

              <button
                onClick={() => window.location.href = '/admin/siswa'}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  🎓
                </div>
                <p className="font-medium text-gray-900">Kelola Siswa</p>
                <p className="text-sm text-gray-500 mt-1">
                  Manage students
                </p>
              </button>

              <button
                onClick={() => window.location.href = '/admin/perusahaan'}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  🏢
                </div>
                <p className="font-medium text-gray-900">Kelola Perusahaan</p>
                <p className="text-sm text-gray-500 mt-1">
                  Manage companies
                </p>
              </button>

              <button
                onClick={() => window.location.href = '/admin/lowongan'}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  💼
                </div>
                <p className="font-medium text-gray-900">Lowongan Magang</p>
                <p className="text-sm text-gray-500 mt-1">
                  Manage internships
                </p>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;