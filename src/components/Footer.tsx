import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 gradient-hero rounded-lg shadow-soft">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">
                SIPINTER<span className="text-primary">-KLAS</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sistem Integrasi Terpadu Penerimaan Siswa Magang dan Bursa Kerja Khusus untuk SMK
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/lowongan" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Lowongan
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="font-semibold mb-4">Untuk Pengguna</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Masuk
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Daftar Akun
                </Link>
              </li>
              <li>
                <Link to="/panduan" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  Panduan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Jl. Pendidikan No. 123, Jakarta</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(021) 1234-5678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@sipinter-klas.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SIPINTER-KLAS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
