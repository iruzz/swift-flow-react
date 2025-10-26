import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

interface ProfileData {
  id?: number;
  nama_perusahaan: string;
  bidang_usaha: string;
  alamat: string;
  kota: string;
  provinsi: string;
  telepon: string;
  website?: string;
  deskripsi?: string;
  pic_name: string;
  pic_jabatan: string;
  pic_telepon: string;
  pic_email: string;
  logo?: string;
  status_verifikasi?: string;
}

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    nama_perusahaan: "",
    bidang_usaha: "",
    alamat: "",
    kota: "",
    provinsi: "",
    telepon: "",
    website: "",
    deskripsi: "",
    pic_name: "",
    pic_jabatan: "",
    pic_telepon: "",
    pic_email: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/perusahaan/profile");
      if (res.data.success) {
        const profile = res.data.data;
        setFormData({
          nama_perusahaan: profile.nama_perusahaan || "",
          bidang_usaha: profile.bidang_usaha || "",
          alamat: profile.alamat || "",
          kota: profile.kota || "",
          provinsi: profile.provinsi || "",
          telepon: profile.telepon || "",
          website: profile.website || "",
          deskripsi: profile.deskripsi || "",
          pic_name: profile.pic_name || "",
          pic_jabatan: profile.pic_jabatan || "",
          pic_telepon: profile.pic_telepon || "",
          pic_email: profile.pic_email || "",
        });
        if (profile.logo) {
          setLogoPreview(`http://localhost:8000/storage/${profile.logo}`);
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

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
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

      if (logoFile) {
        submitData.append("logo", logoFile);
      }

      const res = await axios.post(
        "http://localhost:8000/api/perusahaan/profile",
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
        <Sidebar role="perusahaan" />
        <main className="flex-1 p-8">
          <p className="text-gray-500">Memuat data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="perusahaan" />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile Perusahaan</h1>
            <p className="text-gray-600 mt-1">
              {hasProfile ? "Update informasi profile perusahaan Anda" : "Lengkapi profile perusahaan Anda"}
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
            {/* Logo */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Perusahaan"
                    className="w-32 h-32 rounded-lg object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">🏢</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Perusahaan
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleLogoChange}
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

            {/* Nama Perusahaan & Bidang Usaha */}
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
                  value={formData.nama_perusahaan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama perusahaan"
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
                  value={formData.bidang_usaha}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Teknologi, Manufaktur, dll"
                />
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
                placeholder="021xxxxxxxxx"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.example.com"
              />
            </div>

            {/* Kota & Provinsi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kota <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kota"
                  required
                  maxLength={100}
                  value={formData.kota}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jakarta"
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
                  value={formData.provinsi}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="DKI Jakarta"
                />
              </div>
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
                placeholder="Alamat lengkap perusahaan"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                rows={4}
                value={formData.deskripsi}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Deskripsi singkat tentang perusahaan"
              />
            </div>

            {/* PIC Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">PIC (Person in Charge)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama PIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pic_name"
                    required
                    maxLength={255}
                    value={formData.pic_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nama lengkap PIC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jabatan PIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pic_jabatan"
                    required
                    maxLength={255}
                    value={formData.pic_jabatan}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="HRD, Manager, dll"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telepon PIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="pic_telepon"
                    required
                    maxLength={15}
                    value={formData.pic_telepon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email PIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="pic_email"
                    required
                    value={formData.pic_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="pic@example.com"
                  />
                </div>
              </div>
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