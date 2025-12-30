import { Routes, Route } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import RegistrationForm from './components/RegistrationForm';
import MathProjectUpload from './components/MathProjectUpload';
import MathUploadedProjects from './components/MathUploadedProjects';
import NxtZenWinter2025Page from './components/NxtZenWinter2025Page';
import Linguistic2025Page from './components/Linguistic2025Page';
import ViruthaiPongalPage from './components/ViruthaiPongalPage';
import ViruthaiPongalAdmin from './components/ViruthaiPongalAdmin';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow relative z-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/math" element={<RegistrationForm />} />
          <Route path="/math/upload" element={<MathProjectUpload />} />
          <Route path="/nxtzenwinter2025" element={<NxtZenWinter2025Page />} />
          <Route path="/linguistic2025" element={<Linguistic2025Page />} />
          <Route path="/viruthaipongal2026" element={<ViruthaiPongalPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/math" element={
            <ProtectedRoute>
              <MathUploadedProjects />
            </ProtectedRoute>
          } />
          <Route path="/admin/viruthai" element={
            <ProtectedRoute>
              <ViruthaiPongalAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
