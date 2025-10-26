import Sidebar from "./Sidebar";

export default function Layout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  return (
    <div className="flex">
      <Sidebar role={role} />
      {/* Margin kiri sesuai lebar sidebar */}
      <main className="flex-1 ml-64 p-6 min-h-screen bg-gray-50 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
