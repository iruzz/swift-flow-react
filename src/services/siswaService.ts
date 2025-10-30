// src/services/siswaService.ts
import api from './api';

export const siswaService = {
  // Ambil semua lowongan
  async getLowongan(params?: any) {
    const response = await api.get('/siswa/lowongan', { params });
    return response.data;
  },

  // Ambil detail lowongan
  async getLowonganDetail(id: number) {
    const response = await api.get(`/siswa/lowongan/${id}`);
    return response.data;
  },

  // Ambil lamaran saya
  async getLamaran() {
    const response = await api.get('/siswa/lamaran');
    return response.data;
  },

  // Ambil detail lamaran
  async getLamaranDetail(id: number) {
    const response = await api.get(`/siswa/lamaran/${id}`);
    return response.data;
  },

  // Kirim lamaran baru
  async createLamaran(data: FormData) {
    const response = await api.post('/siswa/lamaran', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Batalkan lamaran
  async cancelLamaran(id: number) {
    const response = await api.delete(`/siswa/lamaran/${id}`);
    return response.data;
  },

  // Ambil data magang saya
  async getMagang() {
    const response = await api.get('/siswa/magang');
    return response.data;
  }
};