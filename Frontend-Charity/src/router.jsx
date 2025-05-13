import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/auth/layout/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './components/auth/Register.jsx';
import UserLogin from './components/auth/UserLogin.jsx';
import UserRegister from './components/auth/user-register.jsx';
import CampaignView from './pages/campaigns/CampaignDetail.jsx';
import CreateCampaign from './pages/organization/CreateCampaign.jsx';
import DemoCampaign from './components/campaigns/demo/DemoCampaign.jsx';
import PasswordReset from './components/auth/PasswordReset.jsx';
import VerifyOtpResetPassword from './components/auth/VerifyOtpResetPassword.jsx';
import {ProtectedOrganizationRoute, ProtectedDonorRoute} from './components/ProtectedRoute.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';

export default function AppRouter() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/user-register" element={<UserRegister />} />
            <Route path="/campaigns" element={<DemoCampaign />} />
            <Route path="/user-forgot-password" element={<PasswordReset />} />
            <Route path="/verify-otp" element={<VerifyOtpResetPassword />} />
            

            {/* Protected Organization Routes */}
            <Route path="/org-dashboard" element={
              <ProtectedOrganizationRoute>
                <CampaignView />
              </ProtectedOrganizationRoute>
            } />
            <Route path="/create-campaign" element={
              <ProtectedOrganizationRoute>
                <CreateCampaign />
              </ProtectedOrganizationRoute>
            } />

            {/* Protected User Routes */}
            <Route path="/donor-dashboard" element={
              <ProtectedDonorRoute>
                <DonorDashboard />
              </ProtectedDonorRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}