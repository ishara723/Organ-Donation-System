import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Awareness from './pages/Awareness';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Donor Module
import DonorDashboard from './pages/donor/Dashboard';
import DonorProfile from './pages/donor/Profile';

// Hospital Module
import HospitalDashboard from './pages/hospital/Dashboard';
import HospitalRequests from './pages/hospital/Requests';
import HospitalSearch from './pages/hospital/Search';

// Admin Module
import AdminDashboard from './pages/admin/Dashboard';
import AdminDonors from './pages/admin/Donors';
import AdminRequests from './pages/admin/Requests';
import AdminMatches from './pages/admin/Matches';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<NotFound />} />

            {/* Protected Donor Routes */}
            <Route 
              path="/donor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['DONOR']}>
                  <DonorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/donor/profile" 
              element={
                <ProtectedRoute allowedRoles={['DONOR']}>
                  <DonorProfile />
                </ProtectedRoute>
              } 
            />

            {/* Protected Hospital Routes */}
            <Route 
              path="/hospital/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                  <HospitalDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hospital/requests" 
              element={
                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                  <HospitalRequests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hospital/search" 
              element={
                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                  <HospitalSearch />
                </ProtectedRoute>
              } 
            />

            {/* Protected Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/donors" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDonors />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/requests" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminRequests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/matches" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminMatches />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all Routing */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
