import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

interface ProfileData {
  id?: number;
  nisn: string;
  nis: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  telepon: string;
  jurusan: string;
  kelas: string;
  tahun_lulus: string;
  foto_profil?: string;
  cv_file?: string;
  status_verifikasi?: string;
}

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    nisn: "",
    nis: "",
    tanggal_lahir: "",
    jenis_kelamin: "L",
    alamat: "",
    telepon: "",
    jurusan: "",
    kelas: "",
    tahun_lulus: new Date().getFullYear().toString(),
  });
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/siswa/profile");
      if (res.data.success) {
        const profile = res.data.data;
        setFormData({
          nisn: profile.nisn || "",
          nis: profile.nis || "",
          tanggal_lahir: profile.tanggal_lahir || "",
          jenis_kelamin: profile.jenis_kelamin || "L",
          alamat: profile.alamat || "",
          telepon: profile.telepon || "",
          jurusan: profile.jurusan || "",
          kelas: profile.kelas || "",
          tahun_lulus: profile.tahun_lulus?.toString() || "",
        });
        if (profile.foto_profil) {
          setFotoPreview(`http://localhost:8000/storage/${profile.foto_profil}`);
        }
        setHasProfile(true);
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error("Error fetching profile:", err);
      }
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleCvChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key as keyof ProfileData] as string);
      });

      if (fotoFile) {
        submitData.append("foto_profil", fotoFile);
      }
      if (cvFile) {
        submitData.append("cv_file", cvFile);
      }

      const res = await axios.post(
        "http://localhost:8000/api/siswa/profile",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchProfile();
      }
    } catch (err: any) {
      console.error("Error saving profile:", err);
      alert(err.response?.data?.message || "Gagal menyimpan profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="siswa" />
        <main className="flex-1 p-8">
          <p className="text-gray-500">Memuat data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="siswa" />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile Siswa</h1>
            <p className="text-gray-600 mt-1">
              {hasProfile ? "Update informasi profile Anda" : "Lengkapi profile Anda"}
            </p>
          </div>

          {formData.status_verifikasi && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                formData.status_verifikasi === "approved"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : formData.status_verifikasi === "rejected"
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-yellow-50 border border-yellow-200 text-yellow-700"
              }`}
            >
              <p className="font-medium">
                Status Verifikasi:{" "}
                {formData.status_verifikasi === "approved"
                  ? "✓ Terverifikasi"
                  : formData.status_verifikasi === "rejected"
                  ? "✗ Ditolak"
                  : "⏳ Menunggu Verifikasi"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Foto Profil */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {fotoPreview ? (
                  <img
                    src={fotoPreview}
                    alt="Foto Profil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">👤</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Profil
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFotoChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG (Max. 2MB)
                </p>
              </div>
            </div>

            {/* NISN & NIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NISN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nisn"
                  required
                  maxLength={10}
                  value={formData.nisn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan NISN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIS <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nis"
                  required
                  maxLength={20}
                  value={formData.nis}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan NIS"
                />
              </div>
            </div>

            {/* Tanggal Lahir & Jenis Kelamin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  required
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  name="jenis_kelamin"
                  required
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telepon"
                required
                maxLength={15}
                value={formData.telepon}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alamat"
                required
                rows={3}
                value={formData.alamat}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alamat lengkap"
              />
            </div>

            {/* Jurusan & Kelas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jurusan"
                  required
                  maxLength={100}
                  value={formData.jurusan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="RPL, TKJ, MM, dll"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kelas"
                  required
                  maxLength={20}
                  value={formData.kelas}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="XII RPL 1"
                />
              </div>
            </div>

            {/* Tahun Lulus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Lulus <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="tahun_lulus"
                required
                min="2000"
                max="2100"
                value={formData.tahun_lulus}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2024"
              />
            </div>

            {/* CV File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CV (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleCvChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500">PDF (Max. 5MB)</p>
              {formData.cv_file && (
                <p className="mt-2 text-sm text-blue-600">
                  ✓ CV sudah terupload
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
              >
                {saving ? "Menyimpan..." : hasProfile ? "Update Profile" : "Simpan Profile"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;