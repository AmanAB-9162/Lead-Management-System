import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import LeadsList from './pages/LeadsList';
import LeadForm from './pages/LeadForm';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/leads" replace />
              </ProtectedRoute>
            } />
            
            <Route path="/leads" element={
              <ProtectedRoute>
                <Layout>
                  <LeadsList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/leads/new" element={
              <ProtectedRoute>
                <Layout>
                  <LeadForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/leads/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <LeadForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/leads" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
