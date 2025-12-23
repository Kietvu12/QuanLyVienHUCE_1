import { useState } from 'react';
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './page/Login';

// Rector pages
import RectorDashboard from './page/rector/Dashboard';
import RectorProfile from './page/rector/Profile';
import RectorAccountManager from './page/rector/AccountManager';
import RectorRevenue from './page/rector/Renueve';
import RectorResearch from './page/rector/Research';
import RectorPersonnel from './page/rector/Personnel';
import RectorAsset from './page/rector/Asset';
import RectorReport from './page/rector/Report';
import RectorCreateReport from './page/rector/CreateReport';

// Principal pages
import PrincipalDashboard from './page/principal/Dashboard';
import PrincipalProfile from './page/principal/Profile';
import PrincipalInstitute from './page/principal/Institute';
import PrincipalResearch from './page/principal/Research';
import PrincipalPersonnel from './page/principal/Personnel';
import PrincipalRevenue from './page/principal/Revenue';
import PrincipalAsset from './page/principal/Asset';
import PrincipalReport from './page/principal/Report';

// Division pages
import DivisionDashboard from './page/division/Dashboard';
import DivisionProfile from './page/division/Profile';
import DivisionRevenue from './page/division/Revenue';
import DivisionResearch from './page/division/Research';
import DivisionPersonnel from './page/division/Personnel';
import DivisionReport from './page/division/Report';

// Accountant pages
import AccountantDashboard from './page/accountant/Dashboard';
import AccountantProfile from './page/accountant/Profile';
import AccountantRevenue from './page/accountant/Revenue';
import AccountantReport from './page/accountant/Report';
import AccountantInvoice from './page/accountant/Invoice';
import AccountantPersonnel from './page/accountant/Personnel';
import AccountantAsset from './page/accountant/Asset';
import AccountantResearch from './page/accountant/Research';

import './App.css';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Mostrar loading mientras se verifica el usuario
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login route - redirect if already logged in */}
      <Route
        path="/login"
        element={
          user && user.role ? (
            <Navigate to={`/${user.role}/dashboard`} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Rector routes */}
      <Route
        path="/rector/*"
        element={
          <ProtectedRoute requiredRole="rector">
            <div className="flex h-screen bg-[#F8F9FA]">
              <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={closeMobileMenu} />
              <main className="flex-1 overflow-auto bg-[#F8F9FA]">
                <Header onMenuClick={toggleMobileMenu} />
                <div className="px-6 py-4">
                  <Routes>
                    <Route path="/" element={<Navigate to="/rector/dashboard" replace />} />
                    <Route path="/dashboard" element={<RectorDashboard />} />
                    <Route path="/profile" element={<RectorProfile />} />
                    <Route path="/accountmanager" element={<RectorAccountManager />} />
                    <Route path="/revenue" element={<RectorRevenue />} />
                    <Route path="/research" element={<RectorResearch />} />
                    <Route path="/personnel" element={<RectorPersonnel />} />
                    <Route path="/asset" element={<RectorAsset />} />
                    <Route path="/report" element={<RectorReport />} />
                    <Route path="/report/create" element={<RectorCreateReport />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Principal routes */}
      <Route
        path="/principal/*"
        element={
          <ProtectedRoute requiredRole="principal">
            <div className="flex h-screen bg-[#F8F9FA]">
              <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={closeMobileMenu} />
              <main className="flex-1 overflow-auto bg-[#F8F9FA]">
                <Header onMenuClick={toggleMobileMenu} />
                <div className="px-6 py-4">
                  <Routes>
                    <Route path="/" element={<Navigate to="/principal/dashboard" replace />} />
                    <Route path="/dashboard" element={<PrincipalDashboard />} />
                    <Route path="/profile" element={<PrincipalProfile />} />
                    <Route path="/institute" element={<PrincipalInstitute />} />
                    <Route path="/personnel" element={<PrincipalPersonnel />} />
                    <Route path="/revenue" element={<PrincipalRevenue />} />
                    <Route path="/asset" element={<PrincipalAsset />} />
                    <Route path="/research" element={<PrincipalResearch />} />
                    <Route path="/report" element={<PrincipalReport />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Division routes */}
      <Route
        path="/division/*"
        element={
          <ProtectedRoute requiredRole="division">
      <div className="flex h-screen bg-[#F8F9FA]">
        <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={closeMobileMenu} />
        <main className="flex-1 overflow-auto bg-[#F8F9FA]">
          <Header onMenuClick={toggleMobileMenu} />
          <div className="px-6 py-4">
            <Routes>
                    <Route path="/" element={<Navigate to="/division/dashboard" replace />} />
                    <Route path="/dashboard" element={<DivisionDashboard />} />
                    <Route path="/profile" element={<DivisionProfile />} />
                    <Route path="/revenue" element={<DivisionRevenue />} />
                    <Route path="/research" element={<DivisionResearch />} />
                    <Route path="/personnel" element={<DivisionPersonnel />} />
                    <Route path="/report" element={<DivisionReport />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Accountant routes */}
      <Route
        path="/accountant/*"
        element={
          <ProtectedRoute requiredRole="accountant">
            <div className="flex h-screen bg-[#F8F9FA]">
              <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={closeMobileMenu} />
              <main className="flex-1 overflow-auto bg-[#F8F9FA]">
                <Header onMenuClick={toggleMobileMenu} />
                <div className="px-6 py-4">
                  <Routes>
                    <Route path="/" element={<Navigate to="/accountant/dashboard" replace />} />
                    <Route path="/dashboard" element={<AccountantDashboard />} />
                    <Route path="/revenue" element={<AccountantRevenue />} />
                    <Route path="/research" element={<AccountantResearch />} />
                    <Route path="/personnel" element={<AccountantPersonnel />} />
                    <Route path="/asset" element={<AccountantAsset />} />
                    <Route path="/report/create" element={<RectorCreateReport />} />
                    <Route path="/report" element={<AccountantReport />} />
                    <Route path="/invoice" element={<AccountantInvoice />} />
                    <Route path="/profile" element={<AccountantProfile />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Root redirect - always go to login first */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
