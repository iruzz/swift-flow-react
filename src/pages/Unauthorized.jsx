import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    if (user) {
      switch (user.role) {
        case 'siswa':
          navigate('/siswa/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'perusahaan':
          navigate('/perusahaan/dashboard');
          break;
        case 'guru':
          navigate('/guru/dashboard');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600 mb-6">Maaf, Anda tidak memiliki akses ke halaman ini.</p>

          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Kembali ke Dashboard
            </button>
            
            <button
              onClick={() => logout()}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}