import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siswaService } from '../../services/siswaService';
import Sidebar from '../../components/Sidebar'; // ✅ IMPORT SIDEBAR
import { useAuth } from '../../contexts/AuthContext'; // ✅ IMPORT AUTH CONTEXT

interface Lowongan {
  id: number;
  judul: string;
  deskripsi: string;
  lokasi: string;
  durasi_magang: string;
  gaji: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  perusahaan: {
    nama_perusahaan: string;
    logo?: string;
  };
}

const LowonganList: React.FC = () => {
  const { user } = useAuth(); // ✅ GET USER INFO
  const [lowongan, setLowongan] = useState<Lowongan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLowongan, setSelectedLowongan] = useState<Lowongan | null>(null);
  const [formData, setFormData] = useState({
    surat_lamaran: null as File | null,
    cv_file: null as File | null,
    portofolio_file: null as File | null,
    catatan_siswa: '',
    nomor_wa: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLowongan();
  }, [search]);

  const loadLowongan = async () => {
    try {
      setLoading(true);
      const response = await siswaService.getLowongan({ search });
      setLowongan(response.data.data);
    } catch (error) {
      console.error('Gagal memuat lowongan');
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

  const handleLamarClick = (lowongan: Lowongan) => {
    setSelectedLowongan(lowongan);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // ✅ VALIDASI FILE SIZE
      if (field === 'surat_lamaran' || field === 'cv_file') {
        if (file.size > 2 * 1024 * 1024) { // 2MB
          alert('File terlalu besar. Maksimal 2MB');
          e.target.value = ''; // Reset input
          return;
        }
      }
      
      if (field === 'portofolio_file' && file.size > 5 * 1024 * 1024) { // 5MB
        alert('File terlalu besar. Maksimal 5MB');
        e.target.value = ''; // Reset input
        return;
      }

      // ✅ VALIDASI FILE TYPE
      const allowedTypes = ['application/pdf', 'application/zip', 'application/x-zip-compressed'];
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.zip')) {
        alert('Hanya file PDF atau ZIP yang diizinkan');
        e.target.value = ''; // Reset input
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
    
    if (!selectedLowongan) return;

    // Validasi file required + nomor_wa
    if (!formData.surat_lamaran || !formData.cv_file || !formData.nomor_wa) {
      alert('Surat lamaran, CV, dan nomor WA wajib diisi');
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = new FormData();
      submitData.append('lowongan_id', selectedLowongan.id.toString());
      submitData.append('surat_lamaran', formData.surat_lamaran);
      submitData.append('cv_file', formData.cv_file);
      submitData.append('nomor_wa', formData.nomor_wa); // ✅ TAMBAH INI
      
      if (formData.portofolio_file) {
        submitData.append('portofolio_file', formData.portofolio_file);
      }
      
      if (formData.catatan_siswa) {
        submitData.append('catatan_siswa', formData.catatan_siswa);
      }

      await siswaService.createLamaran(submitData);
      
      alert('Lamaran berhasil dikirim!');
      setShowModal(false);
      setFormData({
        surat_lamaran: null,
        cv_file: null,
        portofolio_file: null,
        catatan_siswa: '',
        nomor_wa: '' // ✅ RESET JUGA
      });
      
    } catch (error: any) {
      console.error('Gagal mengirim lamaran:', error);
      alert(error.response?.data?.message || 'Gagal mengirim lamaran');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLowongan(null);
    setFormData({
      surat_lamaran: null,
      cv_file: null,
      portofolio_file: null,
      catatan_siswa: '',
      nomor_wa: '' // ✅ TAMBAH INI
    });
  };

  // ✅ LOADING STATE DENGAN SIDEBAR
  if (loading) return (
    <div className="flex min-h-screen">
      <Sidebar role={user?.role || 'siswa'} />
      <div className="flex-1 ml-64 p-6">
        <div className="flex justify-center py-8">Memuat lowongan...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Cari Lowongan Magang</h1>
            <Link
              to="/siswa/lamaran"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Lihat Lamaran Saya
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari lowongan, perusahaan, atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Lowongan List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lowongan.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.judul}</h3>
                  <p className="text-gray-600 mb-3">{item.perusahaan.nama_perusahaan}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>📍 {item.lokasi}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>⏱️ {item.durasi_magang}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>💰 {formatCurrency(item.gaji)}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {item.deskripsi}
                  </p>

                  <div className="flex justify-between items-center gap-2">
                    <Link
                      to={`/siswa/lowongan/${item.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm flex-1 text-center transition-colors"
                    >
                      Lihat Detail
                    </Link>
                    <button
                      onClick={() => handleLamarClick(item)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm flex-1 transition-colors"
                    >
                      Lamar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Form Lamar */}
          {showModal && selectedLowongan && (
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
                    <h3 className="font-semibold text-lg">{selectedLowongan.judul}</h3>
                    <p className="text-gray-600">{selectedLowongan.perusahaan.nama_perusahaan}</p>
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
                        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
                      >
                        {submitting ? 'Mengirim...' : 'Submit Lamaran'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {lowongan.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-yellow-800 font-medium mb-2">Tidak Ada Lowongan</p>
                <p className="text-yellow-600 text-sm">
                  {search ? 'Tidak ada lowongan yang sesuai dengan pencarian' : 'Belum ada lowongan magang tersedia'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LowonganList;