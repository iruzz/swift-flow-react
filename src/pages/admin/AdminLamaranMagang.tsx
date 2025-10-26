import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Search, Eye, Check, X, Trash2, Filter, ChevronLeft, ChevronRight, FileText, User, Calendar, Briefcase, Download, Clock, MessageSquare } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const API_URL = 'http://localhost:8000/api';

interface SiswaData {
  id: number;
  nisn: string;
  nis: string;
  jurusan: string;
  kelas: string;
  user?: {
    name: string;
    email: string;
  };
}

interface PerusahaanData {
  id: number;
  nama_perusahaan: string;
}

interface LowonganData {
  id: number;
  judul: string;
  tipe_lowongan: string;
  lokasi: string;
  perusahaan?: PerusahaanData;
}

interface LamaranData {
  id: number;
  siswa_id: number;
  lowongan_id: number;
  status: string;
  surat_lamaran: string;
  cv_file: string;
  portofolio_file: string | null;
  catatan_siswa: string | null;
  catatan_perusahaan: string | null;
  tanggal_apply: string;
  tanggal_interview: string | null;
  created_at: string;
  siswa?: SiswaData;
  lowongan?: LowonganData;
}

interface StatsData {
  total: number;
  pending: number;
  interview: number;
  proses: number;
  diterima: number;
  ditolak: number;
}

const AdminLamaranMagang = () => {
  const [lamaran, setLamaran] = useState<LamaranData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    pending: 0,
    interview: 0,
    proses: 0,
    diterima: 0,
    ditolak: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedLamaran, setSelectedLamaran] = useState<LamaranData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  const [interviewForm, setInterviewForm] = useState({
    tanggal_interview: '',
    catatan_perusahaan: ''
  });
  const [rejectReason, setRejectReason] = useState('');

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/lamaran/statistics`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLamaran = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        per_page: perPage,
      };

      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const response = await axios.get(`${API_URL}/admin/lamaran`, { params });

      if (response.data.success) {
        setLamaran(response.data.data.data);
        setTotalPages(response.data.data.last_page);
      }
    } catch (error) {
      console.error('Error fetching lamaran:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLamaran();
  }, [currentPage, perPage, search, statusFilter]);

  const viewLamaran = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/admin/lamaran/${id}`);

      if (response.data.success) {
        setSelectedLamaran(response.data.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching lamaran:', error);
    }
  };

  const handleSetInterview = async () => {
    if (!selectedLamaran || !interviewForm.tanggal_interview) {
      alert('Tanggal interview harus diisi!');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/lamaran/${selectedLamaran.id}/set-interview`,
        interviewForm
      );

      if (response.data.success) {
        alert('Jadwal interview berhasil diset!');
        setShowInterviewModal(false);
        setInterviewForm({ tanggal_interview: '', catatan_perusahaan: '' });
        fetchLamaran();
        fetchStats();
        if (showModal) viewLamaran(selectedLamaran.id);
      }
    } catch (error) {
      console.error('Error setting interview:', error);
      alert('Gagal set jadwal interview');
    }
  };

  const terimaLamaran = async (id: number, catatan?: string) => {
    if (!confirm('Terima lamaran ini?')) return;

    try {
      const response = await axios.post(`${API_URL}/admin/lamaran/${id}/terima`, {
        catatan_perusahaan: catatan || null
      });

      if (response.data.success) {
        alert('Lamaran diterima!');
        fetchLamaran();
        fetchStats();
        if (showModal) viewLamaran(id);
      }
    } catch (error) {
      console.error('Error accepting lamaran:', error);
      alert('Gagal menerima lamaran');
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedLamaran || !rejectReason.trim()) {
      alert('Alasan penolakan harus diisi!');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/lamaran/${selectedLamaran.id}/tolak`,
        { catatan_perusahaan: rejectReason }
      );

      if (response.data.success) {
        alert('Lamaran ditolak!');
        setShowRejectModal(false);
        setRejectReason('');
        fetchLamaran();
        fetchStats();
        if (showModal) viewLamaran(selectedLamaran.id);
      }
    } catch (error) {
      console.error('Error rejecting lamaran:', error);
      alert('Gagal menolak lamaran');
    }
  };

  const deleteLamaran = async (id: number) => {
    if (!confirm('Hapus lamaran ini? Data tidak dapat dikembalikan!')) return;

    try {
      const response = await axios.delete(`${API_URL}/admin/lamaran/${id}`);

      if (response.data.success) {
        alert('Lamaran berhasil dihapus!');
        fetchLamaran();
        fetchStats();
        if (showModal) setShowModal(false);
      }
    } catch (error) {
      console.error('Error deleting lamaran:', error);
      alert('Gagal menghapus lamaran');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-blue-100 text-blue-800',
      proses: 'bg-purple-100 text-purple-800',
      diterima: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.pending;
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Pending',
      interview: 'Interview',
      proses: 'Proses',
      diterima: 'Diterima',
      ditolak: 'Ditolak'
    };
    return texts[status] || status;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Lamaran</h1>
            <p className="text-gray-600">Kelola lamaran magang dari siswa</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-yellow-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
            </div>
            <div className="bg-blue-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-blue-600">Interview</div>
              <div className="text-2xl font-bold text-blue-800">{stats.interview}</div>
            </div>
            <div className="bg-purple-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-purple-600">Proses</div>
              <div className="text-2xl font-bold text-purple-800">{stats.proses}</div>
            </div>
            <div className="bg-green-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-green-600">Diterima</div>
              <div className="text-2xl font-bold text-green-800">{stats.diterima}</div>
            </div>
            <div className="bg-red-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-red-600">Ditolak</div>
              <div className="text-2xl font-bold text-red-800">{stats.ditolak}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari nama siswa, NISN, lowongan..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="interview">Interview</option>
                  <option value="proses">Proses</option>
                  <option value="diterima">Diterima</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10 per halaman</option>
                  <option value={25}>25 per halaman</option>
                  <option value={50}>50 per halaman</option>
                  <option value={100}>100 per halaman</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : lamaran.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Tidak ada data lamaran</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lowongan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Apply</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lamaran.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                {item.siswa?.user?.name?.charAt(0).toUpperCase() || 'S'}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.siswa?.user?.name}</div>
                                <div className="text-sm text-gray-500">{item.siswa?.nisn}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.lowongan?.judul}</div>
                            <div className="text-sm text-gray-500">{item.lowongan?.perusahaan?.nama_perusahaan}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggal_apply}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => viewLamaran(item.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              {/* Tombol untuk status Pending */}
                              {item.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedLamaran(item);
                                      setShowInterviewModal(true);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Set Interview"
                                  >
                                    <Clock className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => terimaLamaran(item.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Terima Langsung"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedLamaran(item);
                                      setShowRejectModal(true);
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Tolak"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              {/* Tombol untuk status Interview */}
                              {item.status === 'interview' && (
                                <>
                                  <button
                                    onClick={() => terimaLamaran(item.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Lolos Interview - Terima"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedLamaran(item);
                                      setShowRejectModal(true);
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Tidak Lolos Interview"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              {/* Tombol untuk status Proses */}
                              {item.status === 'proses' && (
                                <>
                                  <button
                                    onClick={() => terimaLamaran(item.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Terima"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedLamaran(item);
                                      setShowRejectModal(true);
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Tolak"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              
                              <button
                                onClick={() => deleteLamaran(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {showModal && selectedLamaran && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Detail Lamaran</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(selectedLamaran.status)}`}>
                  {getStatusText(selectedLamaran.status)}
                </span>
                <div className="text-sm text-gray-500">
                  Diajukan: {selectedLamaran.tanggal_apply}
                </div>
              </div>

              {/* Siswa Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informasi Siswa
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Nama</div>
                    <div className="font-medium text-gray-900">{selectedLamaran.siswa?.user?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">NISN</div>
                    <div className="font-medium text-gray-900">{selectedLamaran.siswa?.nisn}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Kelas</div>
                    <div className="font-medium text-gray-900">{selectedLamaran.siswa?.kelas}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Jurusan</div>
                    <div className="font-medium text-gray-900">{selectedLamaran.siswa?.jurusan}</div>
                  </div>
                </div>
              </div>

              {/* Lowongan Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Informasi Lowongan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Posisi</div>
                    <div className="font-medium text-gray-900">{selectedLamaran.lowongan?.judul}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Perusahaan</div>
                    <div className="font-medium text-gray-900">{selectedLamaran.lowongan?.perusahaan?.nama_perusahaan}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Tipe</div>
                    <div className="font-medium text-gray-900">{selectedLamaran.lowongan?.tipe_lowongan}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Lokasi</div>
                    <div className="font-medium text-gray-900">{selectedLamaran.lowongan?.lokasi}</div>
                  </div>
                </div>
              </div>

              {/* Files */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Berkas Lamaran
                </h3>
                <div className="space-y-2">
                  <a
                    href={`http://localhost:8000/storage/${selectedLamaran.surat_lamaran}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-900">Surat Lamaran</span>
                    <Download className="w-4 h-4 text-blue-600" />
                  </a>
                  <a
                    href={`http://localhost:8000/storage/${selectedLamaran.cv_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-900">CV</span>
                    <Download className="w-4 h-4 text-blue-600" />
                  </a>
                  {selectedLamaran.portofolio_file && (
                    <a
                      href={`http://localhost:8000/storage/${selectedLamaran.portofolio_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-900">Portofolio</span>
                      <Download className="w-4 h-4 text-blue-600" />
                    </a>
                  )}
                </div>
              </div>

              {/* Catatan */}
              {selectedLamaran.catatan_siswa && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Catatan Siswa
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLamaran.catatan_siswa}</p>
                </div>
              )}

              {selectedLamaran.catatan_perusahaan && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Catatan Perusahaan
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLamaran.catatan_perusahaan}</p>
                </div>
              )}

              {selectedLamaran.tanggal_interview && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Jadwal Interview
                  </h3>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedLamaran.tanggal_interview}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {/* Actions untuk Pending */}
                {selectedLamaran.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setShowInterviewModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Set Interview
                    </button>
                    <button
                      onClick={() => terimaLamaran(selectedLamaran.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Terima Langsung
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setShowRejectModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Tolak
                    </button>
                  </>
                )}

                {/* Actions untuk Interview */}
                {selectedLamaran.status === 'interview' && (
                  <>
                    <button
                      onClick={() => terimaLamaran(selectedLamaran.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Lolos Interview - Terima
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setShowRejectModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Tidak Lolos Interview
                    </button>
                  </>
                )}

                {/* Actions untuk Proses */}
                {selectedLamaran.status === 'proses' && (
                  <>
                    <button
                      onClick={() => terimaLamaran(selectedLamaran.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Terima
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setShowRejectModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Tolak
                    </button>
                  </>
                )}

                {/* Tombol Hapus selalu ada */}
                {(selectedLamaran.status === 'pending' || selectedLamaran.status === 'interview' || selectedLamaran.status === 'proses') && (
                  <button
                    onClick={() => deleteLamaran(selectedLamaran.id)}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && selectedLamaran && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Set Jadwal Interview</h2>
              <button
                onClick={() => {
                  setShowInterviewModal(false);
                  setInterviewForm({ tanggal_interview: '', catatan_perusahaan: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal & Waktu Interview <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={interviewForm.tanggal_interview}
                  onChange={(e) => setInterviewForm({ ...interviewForm, tanggal_interview: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Tambahkan catatan untuk siswa..."
                  value={interviewForm.catatan_perusahaan}
                  onChange={(e) => setInterviewForm({ ...interviewForm, catatan_perusahaan: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowInterviewModal(false);
                    setInterviewForm({ tanggal_interview: '', catatan_perusahaan: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSetInterview}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Set Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedLamaran && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Tolak Lamaran</h2>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                  placeholder="Berikan alasan penolakan untuk siswa..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  Pastikan Anda memberikan alasan yang jelas dan membangun untuk siswa.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleRejectSubmit}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Tolak Lamaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLamaranMagang;