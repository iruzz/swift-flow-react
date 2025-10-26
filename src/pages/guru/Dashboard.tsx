import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function GuruDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
            <p className="text-sm text-gray-600">Selamat datang, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Siswa Bimbingan</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">32</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Sedang Magang</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">18</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Menunggu Approval</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">7</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Selesai Magang</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">45</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu Pembimbing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-4xl mb-2">👥</div>
              <p className="font-medium">Siswa Bimbingan</p>
            </button>
            
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-medium">Approval Lamaran</p>
            </button>
            
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-4xl mb-2">📊</div>
              <p className="font-medium">Monitoring Magang</p>
            </button>
            
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-4xl mb-2">⭐</div>
              <p className="font-medium">Penilaian</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Siswa Perlu Perhatian</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 border-l-4 border-yellow-500">
              <div>
                <h3 className="font-semibold text-gray-900">Ahmad Fauzi</h3>
                <p className="text-sm text-gray-600">Menunggu approval lamaran ke PT Maju Jaya</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Review
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 border-l-4 border-green-500">
              <div>
                <h3 className="font-semibold text-gray-900">Siti Nurhaliza</h3>
                <p className="text-sm text-gray-600">Laporan magang minggu ini sudah masuk</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Lihat
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 border-l-4 border-red-500">
              <div>
                <h3 className="font-semibold text-gray-900">Budi Santoso</h3>
                <p className="text-sm text-gray-600">Belum submit laporan magang 2 minggu</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Tindak Lanjut
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}