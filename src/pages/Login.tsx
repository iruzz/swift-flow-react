import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8000"; // Ganti sesuai backend Laravel lo
axios.defaults.withCredentials = true; // Penting untuk Sanctum

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Panggil fungsi login dari context
      const result = await login(form.email, form.password);

      if (result.success && result.user) {
        navigate(`/${result.user.role}/dashboard`);
      } else {
        setError(result.message || "Login gagal.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-80"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Login Akun
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Masukkan email"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg w-full p-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Masukkan password"
          value={form.password}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg w-full p-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-lg transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : "Masuk"}
        </button>

        {error && (
          <p className="text-red-500 text-center mt-4 text-sm">{error}</p>
        )}

        <p className="text-center text-sm mt-4 text-gray-600">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Daftar
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
