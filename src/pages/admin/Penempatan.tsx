import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Search, Plus, Eye, Edit, Trash2, Users } from "lucide-react";

interface Penempatan {
  id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  siswa: {
    user: {
      name: string;
      email: string;
    };
    nisn: string;
    jurusan: string;
    kelas: string;
  };
  perusahaan: {
    nama_perusahaan: string;
    kota: string;
  };
  guru_pembimbing: {
    user: {
      name: string;
    };
    nip: string;
  };
  lamaran: {
    lowongan: {
      judul: string;
    };
  };
}

interface LamaranDiterima {
  id: number;
  tanggal_apply: string;
  siswa: {
    user: {
      name: string;
    };
    nisn: string;
    jurusan: string;
  };
  lowongan: {
    judul: string;
    perusahaan: {
      nama_perusahaan: string;
      id: number;
    };
  };
}

interface Guru {
  id: number;
  nip: string;
  mata_pelajaran: string;
  user: {
    name: string;
  };
}

const Penempatan = () => {
  const [penempatan, setPenempatan] = useState<Penempatan[]>([]);
  const [lamaranDiterima, setLamaranDiterima] = useState<LamaranDiterima[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPenempatan, setSelectedPenempatan] = useState<Penempatan | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    lamaran_id: 0,
    guru_pembimbing_id: 0,
    tanggal_mulai: "",
    tanggal_selesai: "",
  });

  const [editFormData, setEditFormData] = useState({
    guru_pembimbing_id: 0,
    tanggal_mulai: "",
    tanggal_selesai: "",
    status: "aktif",
  });

  useEffect(() => {
    fetchPenempatan();
    fetchGuruList();
  }, [search, statusFilter]);

  const fetchPenempatan = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/admin/penempatan", {
        params: { search, status: statusFilter },
      });
      setPenempatan(res.data.data.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLamaranDiterima = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/penempatan/lamaran-diterima");
      setLamaranDiterima(res.data.data.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchGuruList = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/penempatan/guru-pembimbing");
      setGuruList(res.data.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleOpenCreateModal = () => {
    fetchLamaranDiterima();
    setShowCreateModal(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/admin/penempatan", formData);
      alert("Penempatan berhasil dibuat!");
      setShowCreateModal(false);
      resetForm();
      fetchPenempatan();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal membuat penempatan");
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/penempatan/${id}`);
      setSelectedPenempatan(res.data.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEdit = (item: Penempatan) => {
    setSelectedPenempatan(item);
    setEditFormData({
      guru_pembimbing_id: item.guru_pembimbing.user ? item.guru_pembimbing.id : 0,
      tanggal_mulai: item.tanggal_mulai,
      tanggal_selesai: item.tanggal_selesai,
      status: item.status,
    });
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPenempatan) return;

    try {
      await axios.put(
        `http://localhost:8000/api/admin/penempatan/${selectedPenempatan.id}`,
        editFormData
      );
      alert("Penempatan berhasil diupdate!");
      setShowEditModal(false);
      fetchPenempatan();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal update penempatan");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus penempatan ini?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/penempatan/${id}`);
      alert("Penempatan berhasil dihapus!");
      fetchPenempatan();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menghapus penempatan");
    }
  };

  const resetForm = () => {
    setFormData({
      lamaran_id: 0,
      guru_pembimbing_id: 0,
      tanggal_mulai: "",
      tanggal_selesai: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      aktif: "bg-green-100 text-green-800",
      selesai: "bg-blue-100 text-blue-800",
      dibatalkan: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar role="admin" />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Penempatan Magang</h1>
            <p className="text-gray-600 mt-1">Kelola penempatan siswa magang ke perusahaan</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Tambah Penempatan
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari siswa atau perusahaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Memuat data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Siswa", "Perusahaan", "Posisi", "Pembimbing", "Periode", "Status", "Aksi"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {penempatan.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Belum ada data penempatan
                    </td>
                  </tr>
                ) : (
                  penempatan.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.siswa.user.name}</div>
                        <div className="text-sm text-gray-500">{item.siswa.nisn}</div>
                        <div className="text-sm text-gray-500">
                          {item.siswa.jurusan} - {item.siswa.kelas}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.perusahaan.nama_perusahaan}</div>
                        <div className="text-sm text-gray-500">{item.perusahaan.kota}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.lamaran.lowongan.judul}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.guru_pembimbing.user.name}</div>
                        <div className="text-sm text-gray-500">{item.guru_pembimbing.nip}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(item.tanggal_mulai).toLocaleDateString("id-ID")}
                        </div>
                        <div className="text-sm text-gray-500">
                          s/d {new Date(item.tanggal_selesai).toLocaleDateString("id-ID")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2 text-sm">
                        <button
                          onClick={() => handleViewDetail(item.id)}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          <Eye size={16} className="mr-1" />
                          Detail
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-green-600 hover:text-green-800 inline-flex items-center"
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 inline-flex items-center"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Create Penempatan */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Tambah Penempatan Magang</h2>
              <form onSubmit={handleSubmitCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Lamaran yang Diterima <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.lamaran_id}
                    onChange={(e) => setFormData({ ...formData, lamaran_id: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>-- Pilih Siswa --</option>
                    {lamaranDiterima.map((lamaran) => (
                      <option key={lamaran.id} value={lamaran.id}>
                        {lamaran.siswa.user.name} - {lamaran.lowongan.judul} ({lamaran.lowongan.perusahaan.nama_perusahaan})
                      </option>
                    ))}
                  </select>
                  {lamaranDiterima.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Belum ada lamaran yang diterima dan belum ditempatkan
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guru Pembimbing <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.guru_pembimbing_id}
                    onChange={(e) =>
                      setFormData({ ...formData, guru_pembimbing_id: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>-- Pilih Guru --</option>
                    {guruList.map((guru) => (
                      <option key={guru.id} value={guru.id}>
                        {guru.user.name} - {guru.nip} ({guru.mata_pelajaran})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.tanggal_mulai}
                      onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Selesai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.tanggal_selesai}
                      onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={lamaranDiterima.length === 0}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Penempatan */}
        {showEditModal && selectedPenempatan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Edit Penempatan Magang</h2>
              <form onSubmit={handleSubmitEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Siswa</label>
                  <p className="text-gray-900 font-medium">{selectedPenempatan.siswa.user.name}</p>
                  <p className="text-sm text-gray-500">{selectedPenempatan.perusahaan.nama_perusahaan}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guru Pembimbing <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={editFormData.guru_pembimbing_id}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, guru_pembimbing_id: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {guruList.map((guru) => (
                      <option key={guru.id} value={guru.id}>
                        {guru.user.name} - {guru.nip}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editFormData.tanggal_mulai}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, tanggal_mulai: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Selesai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editFormData.tanggal_selesai}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, tanggal_selesai: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="selesai">Selesai</option>
                    <option value="dibatalkan">Dibatalkan</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail */}
        {showDetailModal && selectedPenempatan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Detail Penempatan Magang</h2>

              <div className="space-y-6">
                {/* Siswa Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Users size={20} className="mr-2" />
                    Informasi Siswa
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Nama:</p>
                      <p className="font-medium">{selectedPenempatan.siswa.user.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">NISN:</p>
                      <p className="font-medium">{selectedPenempatan.siswa.nisn}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Jurusan:</p>
                      <p className="font-medium">{selectedPenempatan.siswa.jurusan}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Kelas:</p>
                      <p className="font-medium">{selectedPenempatan.siswa.kelas}</p>
                    </div>
                  </div>
                </div>

                {/* Perusahaan & Posisi */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-700">Perusahaan:</label>
                    <p className="text-gray-900">{selectedPenempatan.perusahaan.nama_perusahaan}</p>
                    <p className="text-sm text-gray-500">{selectedPenempatan.perusahaan.kota}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Posisi:</label>
                    <p className="text-gray-900">{selectedPenempatan.lamaran.lowongan.judul}</p>
                  </div>
                </div>

                {/* Pembimbing */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Guru Pembimbing</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Nama:</p>
                      <p className="font-medium">{selectedPenempatan.guru_pembimbing.user.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">NIP:</p>
                      <p className="font-medium">{selectedPenempatan.guru_pembimbing.nip}</p>
                    </div>
                  </div>
                </div>

                {/* Periode & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-700">Periode Magang:</label>
                    <p className="text-gray-900">
                      {new Date(selectedPenempatan.tanggal_mulai).toLocaleDateString("id-ID")} s/d{" "}
                      {new Date(selectedPenempatan.tanggal_selesai).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Status:</label>
                    <div className="mt-1">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadge(
                          selectedPenempatan.status
                        )}`}
                      >
                        {selectedPenempatan.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Penempatan;