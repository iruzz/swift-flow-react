import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GraduationCap, ArrowLeft, Building2, User, Shield, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("siswa");

  const roles = [
    { value: "siswa", label: "Siswa", icon: User, description: "Cari magang & kerja" },
    { value: "perusahaan", label: "Perusahaan", icon: Building2, description: "Post lowongan" },
    { value: "guru", label: "Guru Pembimbing", icon: UserCheck, description: "Pantau siswa" },
    { value: "admin", label: "Admin Sekolah", icon: Shield, description: "Kelola sistem" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registrasi berhasil! (Demo mode)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 relative overflow-hidden py-12">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>

          <Card className="shadow-medium">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 gradient-hero rounded-xl shadow-glow">
                  <GraduationCap className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl">Daftar ke SIPINTER-KLAS</CardTitle>
                <CardDescription className="mt-2">
                  Buat akun baru untuk mengakses platform
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>Pilih Peran</Label>
                  <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-2 gap-3">
                    {roles.map((r) => (
                      <Label
                        key={r.value}
                        htmlFor={r.value}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-smooth hover:shadow-soft ${
                          role === r.value
                            ? "border-primary bg-primary/5 shadow-soft"
                            : "border-border bg-card"
                        }`}
                      >
                        <RadioGroupItem value={r.value} id={r.value} className="sr-only" />
                        <r.icon className={`h-5 w-5 ${role === r.value ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{r.label}</div>
                          <div className="text-xs text-muted-foreground">{r.description}</div>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@sekolah.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  Daftar Sekarang
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Sudah punya akun? </span>
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Masuk di sini
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
