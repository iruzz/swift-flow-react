import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Search, Eye, Check, X, Trash2, Filter, ChevronLeft, ChevronRight, Briefcase, MapPin, Calendar, Users, DollarSign, Edit, Save, Clock, Building2 } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const API_URL = 'http://localhost:8000/api';

interface PerusahaanData {
  id: number;
  nama_perusahaan: string;
  alamat: string;
  user?: {
    name: string;
    email: string;
  };
}

interface LowonganData {
  id: number;
  perusahaan_id: number;
  tipe_lowongan: string;
  judul: string;
  deskripsi: string;
  persyaratan: string;
  jumlah_posisi: number;
  lokasi: string;
  durasi_magang: number | null;
  gaji: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  status_approval: string;
  catatan_admin: string | null;
  created_at: string;
  perusahaan?: PerusahaanData;
}

interface StatsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  aktif: number;
  magang: number;
  kerja: number;
}

const AdminLowonganMagang = () => {
  const [lowongan, setLowongan] = useState<LowonganData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    aktif: 0,
    magang: 0,
    kerja: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tipeFilter, setTipeFilter] = useState('');
  const [statusApprovalFilter, setStatusApprovalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedLowongan, setSelectedLowongan] = useState<LowonganData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [editForm, setEditForm] = useState({
    judul: '',
    deskripsi: '',
    persyaratan: '',
    jumlah_posisi: 1,
    lokasi: '',
    durasi_magang: '',
    gaji: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'draft',
    status_approval: 'pending',
    catatan_admin: ''
  });

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/lowongan/statistics`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLowongan = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        per_page: perPage,
      };

      if (search) params.search = search;
      if (tipeFilter) params.tipe_lowongan = tipeFilter;
      if (statusApprovalFilter) params.status_approval = statusApprovalFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await axios.get(`${API_URL}/admin/lowongan`, { params });

      if (response.data.success) {
        setLowongan(response.data.data.data);
        setTotalPages(response.data.data.last_page);
      }
    } catch (error) {
      console.error('Error fetching lowongan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLowongan();
  }, [currentPage, perPage, search, tipeFilter, statusApprovalFilter, statusFilter]);

  const viewLowongan = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/admin/lowongan/${id}`);

      if (response.data.success) {
        const data = response.data.data;
        setSelectedLowongan(data);
        setEditForm({
          judul: data.judul,
          deskripsi: data.deskripsi,
          persyaratan: data.persyaratan,
          jumlah_posisi: data.jumlah_posisi,
          lokasi: data.lokasi,
          durasi_magang: data.durasi_magang?.toString() || '',
          gaji: data.gaji || '',
          tanggal_mulai: data.tanggal_mulai,
          tanggal_selesai: data.tanggal_selesai,
          status: data.status,
          status_approval: data.status_approval,
          catatan_admin: data.catatan_admin || ''
        });
        setEditMode(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching lowongan:', error);
    }
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedLowongan) return;

    setSaving(true);
    try {
      const response = await axios.put(
        `${API_URL}/admin/lowongan/${selectedLowongan.id}`,
        editForm
      );

      if (response.data.success) {
        alert('Lowongan berhasil diupdate!');
        setEditMode(false);
        fetchLowongan();
        fetchStats();
        viewLowongan(selectedLowongan.id);
      }
    } catch (error: any) {
      console.error('Error updating lowongan:', error);
      alert(error.response?.data?.message || 'Gagal update lowongan');
    } finally {
      setSaving(false);
    }
  };

  const approveLowongan = async (id: number) => {
    if (!confirm('Setujui lowongan ini?')) return;

    try {
      const response = await axios.post(`${API_URL}/admin/lowongan/${id}/approve`);

      if (response.data.success) {
        alert('Lowongan berhasil disetujui!');
        fetchLowongan();
        fetchStats();
        if (showModal) viewLowongan(id);
      }
    } catch (error) {
      console.error('Error approving lowongan:', error);
      alert('Gagal menyetujui lowongan');
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedLowongan || !rejectReason.trim()) {
      alert('Alasan penolakan harus diisi!');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/lowongan/${selectedLowongan.id}/reject`,
        { catatan_admin: rejectReason }
      );

      if (response.data.success) {
        alert('Lowongan ditolak!');
        setShowRejectModal(false);
        setRejectReason('');
        fetchLowongan();
        fetchStats();
        if (showModal) viewLowongan(selectedLowongan.id);
      }
    } catch (error) {
      console.error('Error rejecting lowongan:', error);
      alert('Gagal menolak lowongan');
    }
  };

  const deleteLowongan = async (id: number) => {
    if (!confirm('Hapus lowongan ini? Data tidak dapat dikembalikan!')) return;

    try {
      const response = await axios.delete(`${API_URL}/admin/lowongan/${id}`);

      if (response.data.success) {
        alert('Lowongan berhasil dihapus!');
        fetchLowongan();
        fetchStats();
        if (showModal) setShowModal(false);
      }
    } catch (error) {
      console.error('Error deleting lowongan:', error);
      alert('Gagal menghapus lowongan');
    }
  };

  const getStatusApprovalBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.pending;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      aktif: 'bg-blue-100 text-blue-800',
      nonaktif: 'bg-orange-100 text-orange-800',
      ditutup: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.draft;
  };

  const getTipeBadge = (tipe: string) => {
    return tipe === 'magang' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-indigo-100 text-indigo-800';
  };

  const formatRupiah = (nilai: string | null) => {
    if (!nilai) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseFloat(nilai));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Lowongan</h1>
            <p className="text-gray-600">Kelola lowongan magang dan pekerjaan dari perusahaan</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-yellow-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
            </div>
            <div className="bg-green-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-green-600">Approved</div>
              <div className="text-2xl font-bold text-green-800">{stats.approved}</div>
            </div>
            <div className="bg-red-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-red-600">Rejected</div>
              <div className="text-2xl font-bold text-red-800">{stats.rejected}</div>
            </div>
            <div className="bg-blue-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-blue-600">Aktif</div>
              <div className="text-2xl font-bold text-blue-800">{stats.aktif}</div>
            </div>
            <div className="bg-purple-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-purple-600">Magang</div>
              <div className="text-2xl font-bold text-purple-800">{stats.magang}</div>
            </div>
            <div className="bg-indigo-50 rounded-lg shadow-sm p-4">
              <div className="text-sm text-indigo-600">Kerja</div>
              <div className="text-2xl font-bold text-indigo-800">{stats.kerja}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari judul, lokasi, perusahaan..."
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
                  value={tipeFilter}
                  onChange={(e) => {
                    setTipeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Semua Tipe</option>
                  <option value="magang">Magang</option>
                  <option value="kerja">Kerja</option>
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={statusApprovalFilter}
                  onChange={(e) => {
                    setStatusApprovalFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Semua Approval</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
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
                  <option value="draft">Draft</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                  <option value="ditutup">Ditutup</option>
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
            ) : lowongan.length === 0 ? (
              <div className="p-12 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Tidak ada data lowongan</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lowongan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lowongan.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                                <Briefcase className="w-5 h-5" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.judul}</div>
                                <div className="text-sm text-gray-500">{item.jumlah_posisi} posisi</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.perusahaan?.nama_perusahaan}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipeBadge(item.tipe_lowongan)}`}>
                              {item.tipe_lowongan === 'magang' ? 'Magang' : 'Kerja'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.lokasi}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusApprovalBadge(item.status_approval)}`}>
                              {item.status_approval}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => viewLowongan(item.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {item.status_approval === 'pending' && (
                                <>
                                  <button
                                    onClick={() => approveLowongan(item.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Setujui"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedLowongan(item);
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
                                onClick={() => deleteLowongan(item.id)}
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

                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Halaman <span className="font-medium">{currentPage}</span> dari <span className="font-medium">{totalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Detail/Edit Modal */}
        {showModal && selectedLowongan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editMode ? 'Edit Lowongan' : 'Detail Lowongan'}
                </h2>
                <div className="flex items-center gap-2">
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Lowongan"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditMode(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {editMode ? (
                  <form onSubmit={handleUpdateSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Judul Lowongan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="judul"
                          required
                          value={editForm.judul}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deskripsi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="deskripsi"
                          required
                          rows={4}
                          value={editForm.deskripsi}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Persyaratan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="persyaratan"
                          required
                          rows={4}
                          value={editForm.persyaratan}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jumlah Posisi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="jumlah_posisi"
                          required
                          min="1"
                          value={editForm.jumlah_posisi}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lokasi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lokasi"
                          required
                          value={editForm.lokasi}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {selectedLowongan.tipe_lowongan === 'magang' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Durasi Magang (bulan)
                          </label>
                          <input
                            type="number"
                            name="durasi_magang"
                            min="1"
                            value={editForm.durasi_magang}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gaji (opsional)
                        </label>
                        <input
                          type="number"
                          name="gaji"
                          min="0"
                          value={editForm.gaji}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Mulai <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="tanggal_mulai"
                          required
                          value={editForm.tanggal_mulai}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Selesai <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="tanggal_selesai"
                          required
                          value={editForm.tanggal_selesai}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="status"
                          required
                          value={editForm.status}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="draft">Draft</option>
                          <option value="aktif">Aktif</option>
                          <option value="nonaktif">Nonaktif</option>
                          <option value="ditutup">Ditutup</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status Approval <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="status_approval"
                          required
                          value={editForm.status_approval}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catatan Admin
                        </label>
                        <textarea
                          name="catatan_admin"
                          rows={3}
                          value={editForm.catatan_admin}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Catatan untuk perusahaan..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 pb-6 border-b">
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                        <Briefcase className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{selectedLowongan.judul}</h3>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4" />
                          {selectedLowongan.perusahaan?.nama_perusahaan}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTipeBadge(selectedLowongan.tipe_lowongan)}`}>
                            {selectedLowongan.tipe_lowongan === 'magang' ? 'Magang' : 'Kerja'}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusApprovalBadge(selectedLowongan.status_approval)}`}>
                            {selectedLowongan.status_approval}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedLowongan.status)}`}>
                            {selectedLowongan.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Users className="w-4 h-4" />
                          <span>Jumlah Posisi</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedLowongan.jumlah_posisi} posisi</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>Lokasi</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedLowongan.lokasi}</p>
                      </div>

                      {selectedLowongan.durasi_magang && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Durasi Magang</span>
                          </div>
                          <p className="font-medium text-gray-900">{selectedLowongan.durasi_magang} bulan</p>
                        </div>
                      )}

                      {selectedLowongan.gaji && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <DollarSign className="w-4 h-4" />
                            <span>Gaji</span>
                          </div>
                          <p className="font-medium text-gray-900">{formatRupiah(selectedLowongan.gaji)}</p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Tanggal Mulai</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedLowongan.tanggal_mulai}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Tanggal Selesai</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedLowongan.tanggal_selesai}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Deskripsi</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedLowongan.deskripsi}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Persyaratan</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedLowongan.persyaratan}</p>
                      </div>

                      {selectedLowongan.catatan_admin && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-semibold text-yellow-800 mb-2">Catatan Admin</h4>
                          <p className="text-yellow-700">{selectedLowongan.catatan_admin}</p>
                        </div>
                      )}
                    </div>

                    {selectedLowongan.status_approval === 'pending' && (
                      <div className="flex gap-3 pt-4 border-t">
                        <button
                          onClick={() => approveLowongan(selectedLowongan.id)}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Setujui
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedLowongan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Tolak Lowongan</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Berikan alasan penolakan untuk lowongan <strong>{selectedLowongan.judul}</strong>
                </p>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Tuliskan alasan penolakan..."
                />
              </div>
              <div className="px-6 py-4 bg-gray-50 flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={!rejectReason.trim()}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
                >
                  Tolak Lowongan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLowonganMagang;