import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedOrganizationRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  const organizationName = localStorage.getItem('organization_name');

  if (!token || !organizationName) {
    localStorage.removeItem('access');
    localStorage.removeItem('organization_name');
    localStorage.removeItem('organization_logo');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('refreshToken');
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ProtectedDonorRoute = ({ children }) => {
  const token = localStorage.getItem('access');
  const selectedCampaign = localStorage.getItem('selectedCampaignId');
  const userEmail = localStorage.getItem('user_email');

  if (!token) {
    // Clear any stale data
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedOrganizationRoute.propTypes = {
  children: PropTypes.node.isRequired
};

ProtectedDonorRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export { ProtectedOrganizationRoute, ProtectedDonorRoute }