import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardNavbar({ title, tabs = [], activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard-navbar">
      <div className="dashboard-navbar-left">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active-tab' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <h2 className="dashboard-title">{title}</h2>
      <div className="dashboard-navbar-right">
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
