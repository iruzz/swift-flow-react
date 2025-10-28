import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Search, Eye, Trash2, Award, TrendingUp } from "lucide-react";

interface Penilaian {
  id: number;
  penilai_type: string;
  nilai_disiplin: number | string;
  nilai_kerjasama: number | string;
  nilai_inisiatif: number | string;
  nilai_teknis: number | string;
  nilai_komunikasi: number | string;
  nilai_akhir: number | string;
  komentar: string;
  created_at: string;
  penilai: {
    name: string;
    email: string;
  };
  penempatan: {
    siswa: {
      user: {
        name: string;
      };
      nisn: string;
      jurusan: string;
    };
    perusahaan: {
      nama_perusahaan: string;
    };
  };
}

const Penilaian = () => {
  const [penilaian, setPenilaian] = useState<Penilaian[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [penilaiFilter, setPenilaiFilter] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPenilaian, setSelectedPenilaian] = useState<Penilaian | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalPenilaian: 0,
    rataRataNilai: 0,
    penilaianPerusahaan: 0,
    penilaianGuru: 0,
  });

  useEffect(() => {
    fetchPenilaian();
  }, [search, penilaiFilter]);

  useEffect(() => {
    calculateStats();
  }, [penilaian]);

  const fetchPenilaian = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/admin/penilaian", {
        params: { search, penilai_type: penilaiFilter },
      });
      setPenilaian(res.data.data.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (penilaian.length === 0) {
      setStats({
        totalPenilaian: 0,
        rataRataNilai: 0,
        penilaianPerusahaan: 0,
        penilaianGuru: 0,
      });
      return;
    }

    // Convert ke number dulu
    const totalNilai = penilaian.reduce((sum, item) => sum + Number(item.nilai_akhir), 0);
    const rataRata = totalNilai / penilaian.length;
    const perusahaan = penilaian.filter((p) => p.penilai_type === "perusahaan").length;
    const guru = penilaian.filter((p) => p.penilai_type === "guru").length;

    setStats({
      totalPenilaian: penilaian.length,
      rataRataNilai: rataRata,
      penilaianPerusahaan: perusahaan,
      penilaianGuru: guru,
    });
  };

  const handleViewDetail = (item: Penilaian) => {
    setSelectedPenilaian(item);
    setShowDetailModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus penilaian ini?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/penilaian/${id}`);
      alert("Penilaian berhasil dihapus!");
      fetchPenilaian();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menghapus penilaian");
    }
  };

  const getPenilaiTypeBadge = (type: string) => {
    return type === "perusahaan"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const getNilaiColor = (nilai: number | string) => {
    const nilaiNum = Number(nilai);
    if (nilaiNum >= 85) return "text-green-600 font-bold";
    if (nilaiNum >= 70) return "text-blue-600 font-semibold";
    if (nilaiNum >= 60) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const getNilaiGrade = (nilai: number | string) => {
    const nilaiNum = Number(nilai);
    if (nilaiNum >= 85) return "A";
    if (nilaiNum >= 70) return "B";
    if (nilaiNum >= 60) return "C";
    if (nilaiNum >= 50) return "D";
    return "E";
  };

  const getProgressBarColor = (nilai: number | string) => {
    const nilaiNum = Number(nilai);
    if (nilaiNum >= 85) return "bg-green-500";
    if (nilaiNum >= 70) return "bg-blue-500";
    if (nilaiNum >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar role="admin" />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Penilaian Magang</h1>
          <p className="text-gray-600 mt-1">Monitoring penilaian siswa magang dari perusahaan dan guru</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Penilaian</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalPenilaian}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Rata-rata Nilai</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.rataRataNilai.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Dari Perusahaan</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.penilaianPerusahaan}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Dari Guru</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.penilaianGuru}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">👨‍🏫</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nama siswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={penilaiFilter}
              onChange={(e) => setPenilaiFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Penilai</option>
              <option value="perusahaan">Perusahaan</option>
              <option value="guru">Guru</option>
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
                  {["Siswa", "Perusahaan", "Penilai", "Tipe", "Nilai Akhir", "Grade", "Tanggal", "Aksi"].map((h) => (
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
                {penilaian.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Belum ada data penilaian
                    </td>
                  </tr>
                ) : (
                  penilaian.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {item.penempatan.siswa.user.name}
                        </div>
                        <div className="text-sm text-gray-500">{item.penempatan.siswa.nisn}</div>
                        <div className="text-sm text-gray-500">{item.penempatan.siswa.jurusan}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.penempatan.perusahaan.nama_perusahaan}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.penilai.name}</div>
                        <div className="text-sm text-gray-500">{item.penilai.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getPenilaiTypeBadge(
                            item.penilai_type
                          )}`}
                        >
                          {item.penilai_type === "perusahaan" ? "Perusahaan" : "Guru"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-2xl ${getNilaiColor(item.nilai_akhir)}`}>
                          {Number(item.nilai_akhir).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-lg font-bold rounded-full ${
                            getNilaiGrade(item.nilai_akhir) === "A"
                              ? "bg-green-100 text-green-800"
                              : getNilaiGrade(item.nilai_akhir) === "B"
                              ? "bg-blue-100 text-blue-800"
                              : getNilaiGrade(item.nilai_akhir) === "C"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getNilaiGrade(item.nilai_akhir)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 space-x-2 text-sm">
                        <button
                          onClick={() => handleViewDetail(item)}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          <Eye size={16} className="mr-1" />
                          Detail
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

        {/* Modal Detail Penilaian */}
        {showDetailModal && selectedPenilaian && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Detail Penilaian</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(selectedPenilaian.created_at).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 text-sm font-semibold rounded-full ${getPenilaiTypeBadge(
                    selectedPenilaian.penilai_type
                  )}`}
                >
                  {selectedPenilaian.penilai_type === "perusahaan" ? "Penilaian Perusahaan" : "Penilaian Guru"}
                </span>
              </div>

              {/* Info Siswa & Penilai */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Informasi Siswa</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Nama:</p>
                      <p className="font-medium text-gray-900">
                        {selectedPenilaian.penempatan.siswa.user.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">NISN:</p>
                      <p className="font-medium text-gray-900">{selectedPenilaian.penempatan.siswa.nisn}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Jurusan:</p>
                      <p className="font-medium text-gray-900">{selectedPenilaian.penempatan.siswa.jurusan}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Perusahaan:</p>
                      <p className="font-medium text-gray-900">
                        {selectedPenilaian.penempatan.perusahaan.nama_perusahaan}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">Penilai</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Nama:</p>
                      <p className="font-medium text-gray-900">{selectedPenilaian.penilai.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email:</p>
                      <p className="font-medium text-gray-900">{selectedPenilaian.penilai.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nilai Akhir Card */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-lg mb-6 text-center">
                <p className="text-sm opacity-90 mb-2">Nilai Akhir</p>
                <p className="text-5xl font-bold mb-2">{Number(selectedPenilaian.nilai_akhir).toFixed(2)}</p>
                <p className="text-2xl font-semibold">
                  Grade: {getNilaiGrade(selectedPenilaian.nilai_akhir)}
                </p>
              </div>

              {/* Detail Nilai */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Rincian Penilaian</h3>

                {[
                  { label: "Disiplin", nilai: Number(selectedPenilaian.nilai_disiplin) },
                  { label: "Kerjasama", nilai: Number(selectedPenilaian.nilai_kerjasama) },
                  { label: "Inisiatif", nilai: Number(selectedPenilaian.nilai_inisiatif) },
                  { label: "Teknis", nilai: Number(selectedPenilaian.nilai_teknis) },
                  { label: "Komunikasi", nilai: Number(selectedPenilaian.nilai_komunikasi) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center">
                    <div className="w-32 text-sm font-medium text-gray-700">{item.label}:</div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-4 mr-3">
                          <div
                            className={`h-4 rounded-full transition-all ${getProgressBarColor(item.nilai)}`}
                            style={{ width: `${item.nilai}%` }}
                          ></div>
                        </div>
                        <span className={`text-lg font-bold ${getNilaiColor(item.nilai)}`}>
                          {item.nilai}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Komentar */}
              {selectedPenilaian.komentar && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Komentar:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedPenilaian.komentar}</p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Penilaian;