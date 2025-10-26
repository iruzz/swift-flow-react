import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  created_at: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "siswa",
    is_verified: false,
  });

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/admin/users`, {
        params: { search, role: roleFilter },
      });
      setUsers(res.data.data.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && currentUser) {
        await axios.put(
          `http://localhost:8000/api/admin/users/${currentUser.id}`,
          formData
        );
        alert("User berhasil diperbarui!");
      } else {
        await axios.post("http://localhost:8000/api/admin/users", formData);
        alert("User berhasil dibuat!");
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      is_verified: user.is_verified,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${id}`);
      alert("User berhasil dihapus!");
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menghapus user");
    }
  };

  const handleVerify = async (id: number) => {
    if (!confirm("Verifikasi user ini?")) return;
    try {
      await axios.post(`http://localhost:8000/api/admin/users/verify/${id}`);
      fetchUsers();
      alert("User berhasil diverifikasi!");
    } catch {
      alert("Gagal memverifikasi user");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "siswa",
      is_verified: false,
    });
    setCurrentUser(null);
    setEditMode(false);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "guru":
        return "bg-blue-100 text-blue-800";
      case "perusahaan":
        return "bg-green-100 text-green-800";
      case "siswa":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Kelola Users</h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Tambah User
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Role</option>
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="perusahaan">Perusahaan</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Nama", "Email", "Role", "Status", "Aksi"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      Tidak ada data user
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.is_verified ? (
                          <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 space-x-3 text-sm">
                        {!user.is_verified && (
                          <button
                            onClick={() => handleVerify(user.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
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

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {editMode ? "Edit User" : "Tambah User"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editMode && "(kosongkan jika tidak diubah)"}
                  </label>
                  <input
                    type="password"
                    required={!editMode}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="perusahaan">Perusahaan</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_verified"
                    checked={formData.is_verified}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_verified: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="is_verified"
                    className="text-sm text-gray-700"
                  >
                    Verified
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {editMode ? "Update" : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
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

      </main>
    </div>
  );
};

export default Users;
