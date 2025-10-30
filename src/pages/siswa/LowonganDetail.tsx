import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { siswaService } from '../../services/siswaService';

interface Lowongan {
  id: number;
  judul: string;
  deskripsi: string;
  persyaratan: string;
  jumlah_posisi: number;
  lokasi: string;
  durasi_magang: string;
  gaji: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  tipe_lowongan: string;
  perusahaan: {
    id: number;
    nama_perusahaan: string;
    deskripsi_perusahaan?: string;
    alamat?: string;
    website?: string;
    logo?: string;
  };
}

const LowonganDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lowongan, setLowongan] = useState<Lowongan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLamaranModal, setShowLamaranModal] = useState(false);
  const [formData, setFormData] = useState({
    surat_lamaran: null as File | null,
    cv_file: null as File | null,
    portofolio_file: null as File | null,
    catatan_siswa: '',
    nomor_wa: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadLowonganDetail();
    }
  }, [id]);

  const loadLowonganDetail = async () => {
    try {
      setLoading(true);
      const response = await siswaService.getLowonganDetail(parseInt(id!));
      setLowongan(response.data);
    } catch (error) {
      console.error('Gagal memuat detail lowongan');
      navigate('/siswa/lowongan');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validasi file size
      if (field === 'surat_lamaran' || field === 'cv_file') {
        if (file.size > 2 * 1024 * 1024) {
          alert('File terlalu besar. Maksimal 2MB');
          e.target.value = '';
          return;
        }
      }
      
      if (field === 'portofolio_file' && file.size > 5 * 1024 * 1024) {
        alert('File terlalu besar. Maksimal 5MB');
        e.target.value = '';
        return;
      }

      // Validasi file type
      const allowedTypes = ['application/pdf', 'application/zip', 'application/x-zip-compressed'];
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.zip')) {
        alert('Hanya file PDF atau ZIP yang diizinkan');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleSubmitLamaran = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lowongan) return;

    // Validasi file required + nomor_wa
    if (!formData.surat_lamaran || !formData.cv_file || !formData.nomor_wa) {
      alert('Surat lamaran, CV, dan nomor WA wajib diisi');
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = new FormData();
      submitData.append('lowongan_id', lowongan.id.toString());
      submitData.append('surat_lamaran', formData.surat_lamaran);
      submitData.append('cv_file', formData.cv_file);
      submitData.append('nomor_wa', formData.nomor_wa);
      
      if (formData.portofolio_file) {
        submitData.append('portofolio_file', formData.portofolio_file);
      }
      
      if (formData.catatan_siswa) {
        submitData.append('catatan_siswa', formData.catatan_siswa);
      }

      const response = await siswaService.createLamaran(submitData);
      
      alert('Lamaran berhasil dikirim!');
      setShowLamaranModal(false);
      
      // Redirect ke detail lamaran yang baru dibuat
      navigate(`/siswa/lamaran/${response.data.data.id}`);
      
    } catch (error: any) {
      console.error('Gagal mengirim lamaran:', error);
      alert(error.response?.data?.message || 'Gagal mengirim lamaran');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowLamaranModal(false);
    setFormData({
      surat_lamaran: null,
      cv_file: null,
      portofolio_file: null,
      catatan_siswa: '',
      nomor_wa: ''
    });
  };

  if (loading) return <div className="flex justify-center py-8">Memuat detail lowongan...</div>;
  if (!lowongan) return <div>Lowongan tidak ditemukan</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/siswa/lowongan" className="text-blue-600 hover:text-blue-800">
          &larr; Kembali ke Daftar Lowongan
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{lowongan.judul}</h1>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                    {lowongan.perusahaan.logo ? (
                      <img 
                        src={lowongan.perusahaan.logo} 
                        alt={lowongan.perusahaan.nama_perusahaan}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <span className="text-gray-500 font-bold text-lg">
                        {lowongan.perusahaan.nama_perusahaan.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{lowongan.perusahaan.nama_perusahaan}</h2>
                    <p className="text-gray-600 text-sm">{lowongan.lokasi}</p>
                  </div>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Dibuka
              </span>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(lowongan.gaji)}</div>
                <div className="text-sm text-gray-500">Gaji/Bulan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{lowongan.durasi_magang}</div>
                <div className="text-sm text-gray-500">Durasi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{lowongan.jumlah_posisi}</div>
                <div className="text-sm text-gray-500">Posisi Tersedia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{lowongan.tipe_lowongan}</div>
                <div className="text-sm text-gray-500">Tipe</div>
              </div>
            </div>
          </div>

          {/* Deskripsi Lowongan */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Deskripsi Pekerjaan</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{lowongan.deskripsi}</p>
            </div>
          </div>

          {/* Persyaratan */}
          {lowongan.persyaratan && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Persyaratan</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{lowongan.persyaratan}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Info Penting */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Informasi Penting</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Tanggal Mulai</label>
                <p className="font-medium">{formatDate(lowongan.tanggal_mulai)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Tanggal Selesai</label>
                <p className="font-medium">{formatDate(lowongan.tanggal_selesai)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Lokasi</label>
                <p className="font-medium">{lowongan.lokasi}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Tipe</label>
                <p className="font-medium">{lowongan.tipe_lowongan}</p>
              </div>
            </div>

            {/* ✅ TOMBOL LAMAR SEKARANG */}
            <button
              onClick={() => setShowLamaranModal(true)}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium mt-6"
            >
              Lamar Sekarang
            </button>

            <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium mt-3">
              Simpan Lowongan
            </button>
          </div>

          {/* Tentang Perusahaan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Tentang Perusahaan</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Nama Perusahaan</label>
                <p className="font-medium">{lowongan.perusahaan.nama_perusahaan}</p>
              </div>
              
              {lowongan.perusahaan.alamat && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Alamat</label>
                  <p className="text-sm">{lowongan.perusahaan.alamat}</p>
                </div>
              )}
              
              {lowongan.perusahaan.website && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <a 
                    href={lowongan.perusahaan.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {lowongan.perusahaan.website}
                  </a>
                </div>
              )}
              
              {lowongan.perusahaan.deskripsi_perusahaan && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                  <p className="text-sm">{lowongan.perusahaan.deskripsi_perusahaan}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MODAL FORM LAMARAN */}
      {showLamaranModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Ajukan Lamaran</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg">{lowongan.judul}</h3>
                <p className="text-gray-600">{lowongan.perusahaan.nama_perusahaan}</p>
              </div>

              <form onSubmit={handleSubmitLamaran}>
                {/* Surat Lamaran */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surat Lamaran (PDF) *
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'surat_lamaran')}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: PDF, maksimal 2MB</p>
                  {formData.surat_lamaran && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {formData.surat_lamaran.name}
                    </p>
                  )}
                </div>

                {/* CV File */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curriculum Vitae (PDF) *
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'cv_file')}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: PDF, maksimal 2MB</p>
                  {formData.cv_file && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {formData.cv_file.name}
                    </p>
                  )}
                </div>

                {/* Portofolio File (Optional) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portofolio (PDF/ZIP) - Opsional
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.zip"
                    onChange={(e) => handleFileChange(e, 'portofolio_file')}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: PDF atau ZIP, maksimal 5MB</p>
                  {formData.portofolio_file && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {formData.portofolio_file.name}
                    </p>
                  )}
                </div>

                {/* Nomor WA */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.nomor_wa}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomor_wa: e.target.value }))}
                    placeholder="Contoh: 081234567890"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Nomor WA aktif untuk konfirmasi</p>
                </div>

                {/* Catatan Siswa */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Tambahan - Opsional
                  </label>
                  <textarea
                    value={formData.catatan_siswa}
                    onChange={(e) => setFormData(prev => ({ ...prev, catatan_siswa: e.target.value }))}
                    placeholder="Tuliskan motivasi atau hal lain yang ingin disampaikan..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400"
                  >
                    {submitting ? 'Mengirim...' : 'Submit Lamaran'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LowonganDetail;