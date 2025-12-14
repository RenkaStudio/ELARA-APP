import React from 'react';
import { Navigate } from 'react-router-dom';

const DashboardPage = () => {
  // Redirect ke halaman ringkasan dashboard
  return <Navigate to="/dashboard" replace />;
};

export default DashboardPage;