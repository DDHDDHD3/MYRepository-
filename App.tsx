import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { Home } from './pages/public/Home';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Students } from './pages/admin/Students';
import { Content } from './pages/admin/Content';
import { Messages } from './pages/admin/Messages';

// Public Route Wrapper
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Layout>{children}</Layout>
);

// Admin Route Wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AdminLayout>{children}</AdminLayout>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/students" element={<AdminRoute><Students /></AdminRoute>} />
        <Route path="/admin/content" element={<AdminRoute><Content /></AdminRoute>} />
        <Route path="/admin/messages" element={<AdminRoute><Messages /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;