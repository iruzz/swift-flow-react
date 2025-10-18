import { Building2, GraduationCap, Shield, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const roles = [
  {
    icon: Shield,
    title: "Admin Sekolah",
    description: "Kelola seluruh sistem, verifikasi pengguna, dan pantau semua aktivitas dalam platform.",
    features: [
      "Manajemen user & verifikasi",
      "Laporan & analitik lengkap",
      "Generate surat otomatis",
      "Kelola lowongan & perusahaan",
    ],
    color: "primary",
  },
  {
    icon: UserCheck,
    title: "Guru Pembimbing",
    description: "Pantau dan evaluasi siswa bimbingan selama proses magang berlangsung.",
    features: [
      "Lihat siswa bimbingan",
      "Verifikasi log harian",
      "Isi penilaian siswa",
      "Laporan progress",
    ],
    color: "secondary",
  },
  {
    icon: GraduationCap,
    title: "Siswa",
    description: "Temukan peluang magang dan kerja yang sesuai dengan minat dan keahlian.",
    features: [
      "Lengkapi profil & portfolio",
      "Daftar lowongan kerja",
      "Isi log harian magang",
      "Tracking status lamaran",
    ],
    color: "accent",
  },
  {
    icon: Building2,
    title: "Perusahaan",
    description: "Posting lowongan dan temukan kandidat terbaik untuk kebutuhan perusahaan.",
    features: [
      "Tambah lowongan magang/kerja",
      "Lihat & filter kandidat",
      "Terima/tolak lamaran",
      "Evaluasi peserta magang",
    ],
    color: "primary",
  },
];

export const RoleSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Dirancang untuk Semua Pengguna
          </h2>
          <p className="text-lg text-muted-foreground">
            Setiap peran memiliki dashboard dan fitur khusus yang disesuaikan
            dengan kebutuhan masing-masing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {roles.map((role, index) => (
            <div
              key={index}
              className="gradient-card p-8 rounded-xl shadow-soft hover:shadow-medium transition-smooth border border-border"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 gradient-hero rounded-lg shadow-soft`}>
                  <role.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{role.title}</h3>
                  <p className="text-muted-foreground">{role.description}</p>
                </div>
              </div>

              <ul className="space-y-2 mt-6">
                {role.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/register">Daftar Sekarang</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
