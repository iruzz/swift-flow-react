import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface User {
  id?: number;
  name: string;
  email: string;
  role: "siswa" | "admin" | "guru" | "perusahaan";
}

interface Props {
  user?: User | null;
  onClose: () => void;
}

const UserForm = ({ user, onClose }: Props) => {
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    role: "siswa",
    ...user,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user) {
        await axios.put(`/api/admin/users/${user.id}`, form);
      } else {
        await axios.post("/api/admin/users", form);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="relative bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl w-[420px] p-6 space-y-5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Tombol Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {user ? "Edit Pengguna" : "Tambah Pengguna"}
        </h2>
        <p className="text-sm text-gray-500">
          {user ? "Perbarui data pengguna yang dipilih." : "Isi data pengguna baru."}
        </p>

        {/* Input Nama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2.5 rounded-lg outline-none transition"
            required
          />
        </div>

        {/* Input Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2.5 rounded-lg outline-none transition"
            required
          />
        </div>

        {/* Pilihan Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peran
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2.5 rounded-lg outline-none transition"
          >
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="perusahaan">Perusahaan</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default UserForm;
