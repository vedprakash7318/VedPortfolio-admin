import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Projects from './pages/Projects';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Placeholder Pages
const DashboardHome = () => <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Dashboard Stats (Coming Soon)</div>;
// const Projects = () => <div>Projects Management</div>;
import Services from './pages/Services';
import Experience from './pages/Experience';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Messages from './pages/Messages';
import DashboardStats from './pages/DashboardStats';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardStats />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/projects" element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />
          <Route path="/dashboard/services" element={<ProtectedRoute><Layout><Services /></Layout></ProtectedRoute>} />
          <Route path="/dashboard/experience" element={<ProtectedRoute><Layout><Experience /></Layout></ProtectedRoute>} />
          <Route path="/dashboard/gallery" element={<ProtectedRoute><Layout><Gallery /></Layout></ProtectedRoute>} />
          <Route path="/dashboard/reviews" element={<ProtectedRoute><Layout><Reviews /></Layout></ProtectedRoute>} />
          <Route path="/dashboard/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
