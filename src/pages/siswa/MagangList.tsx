import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siswaService } from '../../services/siswaService';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  MapPin, 
  User, 
  School, 
  Building2, 
  ClipboardList,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface Magang {
  id: number;
  status: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  pembimbing_industri: string;
  lamaran: {
    lowongan: {
      judul: string;
      perusahaan: {
        nama_perusahaan: string;
        alamat: string;
      };
    };
  };
  guruPembimbing: {
    nama: string;
    telepon?: string;
  } | null;
}

const MagangList: React.FC = () => {
  const { user } = useAuth();
  const [magang, setMagang] = useState<Magang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadMagang();
  }, []);

  const loadMagang = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await siswaService.getMagang();
      setMagang(response.data);
    } catch (error) {
      console.error('Gagal memuat data magang');
      setError('Gagal memuat data magang. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const config: { 
      [key: string]: { 
        color: string; 
        label: string;
        icon: React.ReactNode;
      } 
    } = {
      aktif: {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Aktif',
        icon: <CheckCircle className="w-4 h-4" />
      },
      selesai: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Selesai',
        icon: <CheckCircle className="w-4 h-4" />
      },
      batal: {
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Dibatalkan',
        icon: <XCircle className="w-4 h-4" />
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Menunggu',
        icon: <Clock className="w-4 h-4" />
      }
    };
    return config[status] || config.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const today = new Date().getTime();
    
    if (today < startDate) return 0;
    if (today > endDate) return 100;
    
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    return Math.round((elapsed / totalDuration) * 100);
  };

  const handleDetailClick = (magangId: number) => {
    // Navigasi ke halaman detail magang
    window.location.href = `/siswa/magang/${magangId}`;
  };

  // Loading state dengan sidebar
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar role={user?.role || 'siswa'} />
        <div className="flex-1 ml-64 p-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Memuat data magang...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar role={user?.role || 'siswa'} />
      
      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Magang Saya</h1>
              <p className="text-gray-600 mt-1">Lihat status dan riwayat magang Anda</p>
            </div>
            <Link
              to="/siswa/lowongan"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Cari Lowongan Magang
            </Link>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-red-800 font-medium">{error}</p>
                  <button
                    onClick={loadMagang}
                    className="text-red-600 hover:text-red-700 text-sm font-medium mt-1"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Magang List */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {magang.map((item) => {
              const statusConfig = getStatusConfig(item.status);
              const progress = calculateProgress(item.tanggal_mulai, item.tanggal_selesai);
              
              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Header dengan Status */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {item.lamaran.lowongan.judul}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Progress Bar untuk magang aktif */}
                    {item.status === 'aktif' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress Magang</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Informasi Magang */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Perusahaan</p>
                          <p className="text-gray-900 font-semibold">
                            {item.lamaran.lowongan.perusahaan.nama_perusahaan}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">
                            {item.lamaran.lowongan.perusahaan.alamat}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Periode Magang</p>
                          <p className="text-gray-900">
                            {formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}
                          </p>
                        </div>
                      </div>

                      {item.pembimbing_industri && (
                        <div className="flex items-start gap-3">
                          <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Pembimbing Industri</p>
                            <p className="text-gray-900">{item.pembimbing_industri}</p>
                          </div>
                        </div>
                      )}

                      {item.guruPembimbing && (
                        <div className="flex items-start gap-3">
                          <School className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Guru Pembimbing</p>
                            <p className="text-gray-900">{item.guruPembimbing.nama}</p>
                            {item.guruPembimbing.telepon && (
                              <p className="text-sm text-gray-600">{item.guruPembimbing.telepon}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button 
                        onClick={() => handleDetailClick(item.id)}
                        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <ClipboardList className="w-4 h-4" />
                        Lihat Detail Magang
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {magang.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
                <ClipboardList className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-yellow-800 font-medium mb-2">Belum Ada Magang</p>
                <p className="text-yellow-600 text-sm mb-4">
                  Anda belum memiliki magang aktif. Silakan lamar lowongan terlebih dahulu.
                </p>
                <Link
                  to="/siswa/lowongan"
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 text-sm font-medium inline-block"
                >
                  Cari Lowongan Magang
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MagangList;