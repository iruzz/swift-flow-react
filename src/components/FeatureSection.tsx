import { BookOpen, CheckCircle, FileText, TrendingUp } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Verifikasi Otomatis",
    description: "Sistem verifikasi otomatis untuk perusahaan dan siswa dengan proses yang cepat dan aman.",
    color: "text-primary",
  },
  {
    icon: FileText,
    title: "Manajemen Lamaran",
    description: "Kelola lamaran siswa dengan mudah, dari pendaftaran hingga penempatan kerja.",
    color: "text-secondary",
  },
  {
    icon: BookOpen,
    title: "Log Harian & Evaluasi",
    description: "Pantau progress siswa magang dengan log harian dan sistem penilaian terintegrasi.",
    color: "text-accent",
  },
  {
    icon: TrendingUp,
    title: "Laporan & Analitik",
    description: "Dashboard analitik lengkap untuk memantau performa dan membuat keputusan yang tepat.",
    color: "text-primary",
  },
];

export const FeatureSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Fitur Lengkap untuk Semua Kebutuhan
          </h2>
          <p className="text-lg text-muted-foreground">
            Platform all-in-one yang dirancang khusus untuk memudahkan proses magang
            dan penempatan kerja siswa SMK
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="gradient-card p-6 rounded-xl shadow-soft hover:shadow-medium transition-smooth group"
            >
              <div className={`${feature.color} mb-4`}>
                <feature.icon className="h-10 w-10 group-hover:scale-110 transition-smooth" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
