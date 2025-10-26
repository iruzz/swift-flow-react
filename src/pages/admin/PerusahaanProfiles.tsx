import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Search, Eye, Check, X, Trash2, Filter, Download, ChevronLeft, ChevronRight, FileText, Building, MapPin, Phone, Mail, User, Edit, Save } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const API_URL = 'http://localhost:8000/api';

interface PerusahaanProfile {
  id: number;
  user_id: number;
  nama_perusahaan: string;
  bidang_usaha: string;
  alamat: string;
  kota: string;
  provinsi: string;
  telepon: string;
  website?: string;
  deskripsi?: string;
  logo?: string;
  pic_name: string;
  pic_jabatan: string;
  pic_telepon: string;
  pic_email: string;
  status_verifikasi: string;
  created_at: string;
  updated_at: string;
}

const AdminPerusahaanProfiles = () => {
  const [profiles, setProfiles] = useState<PerusahaanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedProfile, setSelectedProfile] = useState<PerusahaanProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form edit
  const [editForm, setEditForm] = useState({
    nama_perusahaan: '',
    bidang_usaha: '',
    alamat: '',
    kota: '',
    provinsi: '',
    telepon: '',
    website: '',
    deskripsi: '',
    pic_name: '',
    pic_jabatan: '',
    pic_telepon: '',
    pic_email: '',
    status_verifikasi: 'pending'
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        per_page: perPage,
      };

      if (search) params.search = search;
      if (statusFilter) params.status_verifikasi = statusFilter;

      const response = await axios.get(`${API_URL}/admin/perusahaan-profiles`, { params });

      if (response.data.success) {
        setProfiles(response.data.data.data);
        setTotalPages(response.data.data.last_page);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, perPage, search, statusFilter]);

  const viewProfile = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/admin/perusahaan-profiles/${id}`);

      if (response.data.success) {
        const profile = response.data.data;
        setSelectedProfile(profile);
        setEditForm({
          nama_perusahaan: profile.nama_perusahaan,
          bidang_usaha: profile.bidang_usaha,
          alamat: profile.alamat,
          kota: profile.kota,
          provinsi: profile.provinsi,
          telepon: profile.telepon,
          website: profile.website || '',
          deskripsi: profile.deskripsi || '',
          pic_name: profile.pic_name,
          pic_jabatan: profile.pic_jabatan,
          pic_telepon: profile.pic_telepon,
          pic_email: profile.pic_email,
          status_verifikasi: profile.status_verifikasi
        });
        setEditMode(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    setSaving(true);
    try {
      const formData = new FormData();
      
      Object.keys(editForm).forEach(key => {
        formData.append(key, editForm[key as keyof typeof editForm]);
      });

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Laravel needs _method for PUT with FormData
      formData.append('_method', 'PUT');

      const response = await axios.post(
        `${API_URL}/admin/perusahaan-profiles/${selectedProfile.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        alert('Profile berhasil diupdate!');
        setEditMode(false);
        setLogoFile(null);
        fetchProfiles();
        viewProfile(selectedProfile.id);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Gagal update profile');
    } finally {
      setSaving(false);
    }
  };

  const verifyProfile = async (id: number) => {
    if (!confirm('Verifikasi profile perusahaan ini?')) return;
    
    try {
      const response = await axios.post(`${API_URL}/admin/perusahaan-profiles/${id}/verify`);

      if (response.data.success) {
        alert('Profile berhasil diverifikasi!');
        fetchProfiles();
        if (showModal) {
          viewProfile(id);
        }
      }
    } catch (error) {
      console.error('Error verifying profile:', error);
      alert('Gagal verifikasi profile');
    }
  };

  const rejectProfile = async (id: number) => {
    if (!confirm('Tolak profile perusahaan ini?')) return;
    
    try {
      const response = await axios.post(`${API_URL}/admin/perusahaan-profiles/${id}/reject`);

      if (response.data.success) {
        alert('Profile ditolak!');
        fetchProfiles();
        if (showModal) {
          viewProfile(id);
        }
      }
    } catch (error) {
      console.error('Error rejecting profile:', error);
      alert('Gagal menolak profile');
    }
  };

  const deleteProfile = async (id: number) => {
    if (!confirm('Hapus profile perusahaan ini? Data tidak dapat dikembalikan!')) return;
    
    try {
      const response = await axios.delete(`${API_URL}/admin/perusahaan-profiles/${id}`);

      if (response.data.success) {
        alert('Profile berhasil dihapus!');
        fetchProfiles();
        if (showModal) setShowModal(false);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Gagal menghapus profile');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.pending;
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    };
    return texts[status] || status;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Perusahaan Profiles</h1>
            <p className="text-gray-600">Kelola dan verifikasi profile perusahaan</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari nama perusahaan, bidang usaha..."
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
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
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

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : profiles.length === 0 ? (
              <div className="p-12 text-center">
                <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Tidak ada data profile perusahaan</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidang Usaha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {profile.nama_perusahaan.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{profile.nama_perusahaan}</div>
                                <div className="text-sm text-gray-500">{profile.telepon}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.bidang_usaha}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.kota}, {profile.provinsi}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(profile.status_verifikasi)}`}>
                              {getStatusText(profile.status_verifikasi)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => viewProfile(profile.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {profile.status_verifikasi === 'pending' && (
                                <>
                                  <button
                                    onClick={() => verifyProfile(profile.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Verifikasi"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => rejectProfile(profile.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Tolak"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => deleteProfile(profile.id)}
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
        {showModal && selectedProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editMode ? 'Edit Profile Perusahaan' : 'Detail Profile Perusahaan'}
                </h2>
                <div className="flex items-center gap-2">
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Profile"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditMode(false);
                      setLogoFile(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {editMode ? (
                  /* EDIT FORM */
                  <form onSubmit={handleUpdateSubmit} className="space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {selectedProfile.nama_perusahaan.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedProfile.nama_perusahaan}</h3>
                        <p className="text-gray-600">{selectedProfile.bidang_usaha}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Perusahaan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="nama_perusahaan"
                          required
                          maxLength={255}
                          value={editForm.nama_perusahaan}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bidang Usaha <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="bidang_usaha"
                          required
                          maxLength={255}
                          value={editForm.bidang_usaha}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telepon <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="telepon"
                          required
                          maxLength={15}
                          value={editForm.telepon}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={editForm.website}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kota <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="kota"
                          required
                          maxLength={100}
                          value={editForm.kota}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provinsi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="provinsi"
                          required
                          maxLength={100}
                          value={editForm.provinsi}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alamat <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="alamat"
                          required
                          rows={3}
                          value={editForm.alamat}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deskripsi
                        </label>
                        <textarea
                          name="deskripsi"
                          rows={4}
                          value={editForm.deskripsi}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIC Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pic_name"
                          required
                          maxLength={255}
                          value={editForm.pic_name}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIC Jabatan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pic_jabatan"
                          required
                          maxLength={255}
                          value={editForm.pic_jabatan}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIC Telepon <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="pic_telepon"
                          required
                          maxLength={15}
                          value={editForm.pic_telepon}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIC Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="pic_email"
                          required
                          value={editForm.pic_email}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status Verifikasi <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="status_verifikasi"
                          required
                          value={editForm.status_verifikasi}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Logo
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleLogoChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">JPG, PNG (Max. 2MB)</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setLogoFile(null);
                        }}
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
                  /* VIEW MODE */
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {selectedProfile.nama_perusahaan.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedProfile.nama_perusahaan}</h3>
                        <p className="text-gray-600">{selectedProfile.bidang_usaha}</p>
                        <span className={`mt-2 inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedProfile.status_verifikasi)}`}>
                          {getStatusText(selectedProfile.status_verifikasi)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Building className="w-4 h-4" />
                          <span>Bidang Usaha</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedProfile.bidang_usaha}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Phone className="w-4 h-4" />
                          <span>Telepon</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedProfile.telepon}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>Kota</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedProfile.kota}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>Provinsi</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedProfile.provinsi}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <FileText className="w-4 h-4" />
                          <span>Website</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedProfile.website || '-'}</p>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>Alamat</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedProfile.alamat}</p>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <FileText className="w-4 h-4" />
                          <span>Deskripsi</span>
                        </div>
                        <p className="font-medium text-gray-900">{selectedProfile.deskripsi || '-'}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-semibold text-gray-900">PIC (Person in Charge)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <User className="w-4 h-4" />
                            <span>Nama</span>
                          </div>
                          <p className="font-medium text-gray-900">{selectedProfile.pic_name}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <User className="w-4 h-4" />
                            <span>Jabatan</span>
                          </div>
                          <p className="font-medium text-gray-900">{selectedProfile.pic_jabatan}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Phone className="w-4 h-4" />
                            <span>Telepon</span>
                          </div>
                          <p className="font-medium text-gray-900">{selectedProfile.pic_telepon}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </div>
                          <p className="font-medium text-gray-900">{selectedProfile.pic_email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-semibold text-gray-900">Dokumen</h4>
                      <div className="space-y-2">
                        {selectedProfile.logo ? (
                          <a
                            href={`http://localhost:8000/storage/${selectedProfile.logo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                          >
                            <Download className="w-4 h-4" />
                            <span>Logo Perusahaan</span>
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500">Belum upload logo</p>
                        )}
                      </div>
                    </div>

                    {selectedProfile.status_verifikasi === 'pending' && (
                      <div className="flex gap-3 pt-4 border-t">
                        <button
                          onClick={() => verifyProfile(selectedProfile.id)}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Verifikasi
                        </button>
                        <button
                          onClick={() => rejectProfile(selectedProfile.id)}
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
      </main>
    </div>
  );
};

export default AdminPerusahaanProfiles;