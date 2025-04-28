import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelector from './components/RoleSelector.jsx';
import Login from './pages/Login.jsx';
import DonorDashboard from './pages/DonorDashboard.jsx';
import OrgDashboard from './pages/OrgDashboard.jsx';
import Register from './components/auth/Register.jsx';
import UserRegister from './components/auth/user-register.jsx';
//import Login from './components/auth/Login.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PrivateRoute from './utils/PrivateRoute.jsx'
import CampaignList from './pages/campaigns/CampaignList.jsx';
import CampaignDetail from './pages/campaigns/CampaignDetail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DemoCampaign from './components/campaigns/demo/DemoCampaign.jsx';
import UserLogin from './components/auth/UserLogin.jsx';
import CreateCampaign from './pages/organization/CreateCampaign.jsx';
import Navbar from './components/auth/layout/Navbar.jsx';

export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-role" element={<RoleSelector />} />
        <Route path="/donor-dashboard" element={
          <ProtectedRoute><DonorDashboard /></ProtectedRoute>
        } />
        <Route path="/org-dashboard" element={
          <ProtectedRoute><OrgDashboard /></ProtectedRoute>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* <Route path="/campaigns" element={<CampaignList />} /> */}
        <Route path="/campaigns" element={<CampaignDetail />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/campaigns/demo" element={<DemoCampaign />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />

        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
          
        } />
      </Routes>
    </Router>
  );
}
