import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siswaService } from '../../services/siswaService';
import Sidebar from '../../components/Sidebar'; // ✅ IMPORT SIDEBAR
import { useAuth } from '../../contexts/AuthContext'; // ✅ IMPORT AUTH CONTEXT

interface Lamaran {
  id: number;
  status: 'pending' | 'diterima' | 'ditolak' | 'interview' | 'proses';
  tanggal_apply: string;
  tanggal_interview: string | null;
  catatan_perusahaan: string | null;
  lowongan: {
    judul: string;
    perusahaan: {
      nama_perusahaan: string;
    };
  };
}

const LamaranList: React.FC = () => {
  const { user } = useAuth(); // ✅ GET USER INFO
  const [lamaran, setLamaran] = useState<Lamaran[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLamaran();
  }, []);

  const loadLamaran = async () => {
    try {
      setLoading(true);
      const response = await siswaService.getLamaran();
      setLamaran(response.data);
    } catch (error) {
      console.error('Gagal memuat lamaran');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan lamaran ini?')) {
      try {
        await siswaService.cancelLamaran(id);
        loadLamaran();
      } catch (error) {
        alert('Gagal membatalkan lamaran');
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      diterima: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800',
      interview: 'bg-blue-100 text-blue-800',
      proses: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Menunggu',
      diterima: 'Diterima',
      ditolak: 'Ditolak',
      interview: 'Interview',
      proses: 'Proses Seleksi'
    };
    return texts[status as keyof typeof texts] || status;
  };

  // ✅ LOADING STATE DENGAN SIDEBAR
  if (loading) return (
    <div className="flex min-h-screen">
      <Sidebar role={user?.role || 'siswa'} />
      <div className="flex-1 ml-64 p-6">
        <div className="flex justify-center py-8">Memuat lamaran...</div>
      </div>
    </div>
  );

  // ✅ RETURN DENGAN SIDEBAR
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar role={user?.role || 'siswa'} />
      
      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Lamaran Saya</h1>
            <Link
              to="/siswa/lowongan"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cari Lowongan
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lowongan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Apply</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lamaran.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.lowongan.judul}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{item.lowongan.perusahaan.nama_perusahaan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.tanggal_apply).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <Link
                        to={`/siswa/lamaran/${item.id}`}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Detail
                      </Link>
                      {item.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Batalkan
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {lamaran.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-yellow-800 font-medium mb-2">Belum Ada Lamaran</p>
                  <p className="text-yellow-600 text-sm mb-4">
                    Anda belum mengajukan lamaran magang.
                  </p>
                  <Link
                    to="/siswa/lowongan"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition-colors"
                  >
                    Cari Lowongan Magang
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LamaranList;