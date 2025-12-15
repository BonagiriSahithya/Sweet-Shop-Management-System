import React, { useState, useEffect } from 'react';
import API from '../api';
import DashboardNavbar from './DashboardNavbar';
import userBg from '../assets/bg/user-bg.jpg';

export default function UserDashboard() {
  const [sweets, setSweets] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => { fetchSweets(); }, []);

  const fetchSweets = async () => {
    const res = await API.get('/sweets/search');
    setSweets(res.data);
  };

  const purchase = async id => {
    await API.put(`/sweets/purchase/${id}`);
    fetchSweets();
  };

  const tabs = [{ key: 'buy', label: '🛒 Buy Sweets' }];

  return (
    <div
      className="user-bg"
      style={{
        backgroundImage: `url(${userBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <DashboardNavbar title="User Dashboard" tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="page-content container">
        {!activeTab && (
          <div className="card">
            <h3 style={{ textAlign: 'center' }}>Choose an option above</h3>
          </div>
        )}
        {activeTab === 'buy' && (
          <div className="grid">
            {sweets.map(s => (
              <div key={s._id} className="sweet-card">
                <h3>{s.name}</h3>
                <p>{s.category} | ${s.price} | Qty: {s.quantity}</p>
                <button disabled={s.quantity < 1} onClick={() => purchase(s._id)}>
                  {s.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
