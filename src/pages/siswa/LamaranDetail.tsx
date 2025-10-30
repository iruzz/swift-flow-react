import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { siswaService } from '../../services/siswaService';

interface Lamaran {
  id: number;
  status: 'pending' | 'diterima' | 'ditolak' | 'interview' | 'proses';
  tanggal_apply: string;
  tanggal_interview: string | null;
  catatan_siswa: string | null;
  catatan_perusahaan: string | null;
  surat_lamaran: string;
  cv_file: string;
  portofolio_file: string | null;
  lowongan: {
    id: number;
    judul: string;
    lokasi: string;
    durasi_magang: string;
    gaji: number;
    perusahaan: {
      id: number;
      nama_perusahaan: string;
      alamat: string;
      website: string | null;
    };
  };
}

const LamaranDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lamaran, setLamaran] = useState<Lamaran | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadLamaranDetail();
    }
  }, [id]);

  const loadLamaranDetail = async () => {
    try {
      setLoading(true);
      const response = await siswaService.getLamaranDetail(parseInt(id!));
      setLamaran(response.data);
    } catch (error) {
      console.error('Gagal memuat detail lamaran');
      navigate('/siswa/lamaran');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelLamaran = async () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan lamaran ini?')) {
      try {
        await siswaService.cancelLamaran(parseInt(id!));
        alert('Lamaran berhasil dibatalkan');
        navigate('/siswa/lamaran');
      } catch (error) {
        alert('Gagal membatalkan lamaran');
      }
    }
  };

  const downloadFile = (filePath: string, fileName: string) => {
    // Untuk development, gunakan URL langsung ke storage
    const link = document.createElement('a');
    link.href = `http://localhost:8000/storage/${filePath}`;
    link.download = fileName;
    link.click();
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
      pending: 'Menunggu Review',
      diterima: 'Diterima',
      ditolak: 'Ditolak',
      interview: 'Jadwal Interview',
      proses: 'Proses Seleksi'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="flex justify-center py-8">Memuat detail lamaran...</div>;
  if (!lamaran) return <div>Lamaran tidak ditemukan</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/siswa/lamaran" className="text-blue-600 hover:text-blue-800">
          &larr; Kembali ke Lamaran Saya
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Status & Info Utama */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {lamaran.lowongan.judul}
                </h1>
                <p className="text-gray-600 text-lg">{lamaran.lowongan.perusahaan.nama_perusahaan}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(lamaran.status)}`}>
                  {getStatusText(lamaran.status)}
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  Diajukan pada {formatDate(lamaran.tanggal_apply)}
                </p>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Status Lamaran</h3>
              <div className="flex items-center justify-between">
                <div className={`text-center ${lamaran.status !== 'ditolak' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    ✓
                  </div>
                  <p className="text-sm font-medium">Terkirim</p>
                </div>
                
                <div className={`flex-1 h-1 ${lamaran.status === 'proses' || lamaran.status === 'interview' || lamaran.status === 'diterima' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                
                <div className={`text-center ${lamaran.status === 'proses' || lamaran.status === 'interview' || lamaran.status === 'diterima' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    lamaran.status === 'proses' || lamaran.status === 'interview' || lamaran.status === 'diterima' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {lamaran.status === 'ditolak' ? '✕' : '2'}
                  </div>
                  <p className="text-sm font-medium">Dalam Review</p>
                </div>
                
                <div className={`flex-1 h-1 ${lamaran.status === 'interview' || lamaran.status === 'diterima' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                
                <div className={`text-center ${lamaran.status === 'interview' || lamaran.status === 'diterima' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    lamaran.status === 'interview' || lamaran.status === 'diterima' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    3
                  </div>
                  <p className="text-sm font-medium">Interview</p>
                </div>
                
                <div className={`flex-1 h-1 ${lamaran.status === 'diterima' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                
                <div className={`text-center ${lamaran.status === 'diterima' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    lamaran.status === 'diterima' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {lamaran.status === 'ditolak' ? '✕' : '4'}
                  </div>
                  <p className="text-sm font-medium">Selesai</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Lowongan */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Informasi Lowongan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Posisi</label>
                <p className="font-medium">{lamaran.lowongan.judul}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Perusahaan</label>
                <p className="font-medium">{lamaran.lowongan.perusahaan.nama_perusahaan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Lokasi</label>
                <p className="font-medium">{lamaran.lowongan.lokasi}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Durasi</label>
                <p className="font-medium">{lamaran.lowongan.durasi_magang}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gaji</label>
                <p className="font-medium">{formatCurrency(lamaran.lowongan.gaji)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Alamat Perusahaan</label>
                <p className="font-medium">{lamaran.lowongan.perusahaan.alamat}</p>
              </div>
            </div>
          </div>

          {/* Catatan */}
          {(lamaran.catatan_siswa || lamaran.catatan_perusahaan) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Catatan</h3>
              {lamaran.catatan_siswa && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-500">Catatan Anda</label>
                  <p className="mt-1 p-3 bg-blue-50 rounded-lg">{lamaran.catatan_siswa}</p>
                </div>
              )}
              {lamaran.catatan_perusahaan && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Catatan Perusahaan</label>
                  <p className="mt-1 p-3 bg-yellow-50 rounded-lg">{lamaran.catatan_perusahaan}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Dokumen Lamaran */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Dokumen Lamaran</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => downloadFile(lamaran.surat_lamaran, 'surat-lamaran.pdf')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-between items-center"
              >
                <span>Surat Lamaran</span>
                <span className="text-blue-600">Download</span>
              </button>

              <button
                onClick={() => downloadFile(lamaran.cv_file, 'cv.pdf')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-between items-center"
              >
                <span>Curriculum Vitae</span>
                <span className="text-blue-600">Download</span>
              </button>

              {lamaran.portofolio_file && (
                <button
                  onClick={() => downloadFile(lamaran.portofolio_file!, 'portofolio.pdf')}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-between items-center"
                >
                  <span>Portofolio</span>
                  <span className="text-blue-600">Download</span>
                </button>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 space-y-3">
              {lamaran.status === 'pending' && (
                <button
                  onClick={handleCancelLamaran}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Batalkan Lamaran
                </button>
              )}
              
              {lamaran.tanggal_interview && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Jadwal Interview</p>
                  <p className="text-blue-600">{formatDate(lamaran.tanggal_interview)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default LamaranDetail;