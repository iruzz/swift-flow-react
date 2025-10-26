import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("/api/register", form);
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-80"
      >
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Daftar Akun
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg w-full p-2 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg w-full p-2 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg w-full p-2 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-lg transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Loading..." : "Daftar"}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && <p className="text-green-600 text-center mt-4">{success}</p>}

        <p className="text-center text-sm mt-4 text-gray-600">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-green-600 hover:underline font-semibold"
          >
            Masuk
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
