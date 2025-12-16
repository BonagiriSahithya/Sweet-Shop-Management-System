import React, { useState, useEffect } from 'react';
import API from '../api';
import DashboardNavbar from './DashboardNavbar';
import userBg from '../assets/bg/user-bg.jpg';

export default function UserDashboard() {
  const [sweets, setSweets] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [search, setSearch] = useState({ name: '', category: '', minPrice: '', maxPrice: '' });

  useEffect(() => { fetchSweets(); }, []);

  const fetchSweets = async () => {
    const res = await API.get('/sweets/search');
    setSweets(res.data);
  };

  const purchase = async id => {
    await API.put(`/sweets/purchase/${id}`);
    fetchSweets();
  };

  const searchSweets = async () => {
    const res = await API.get('/sweets/search', { params: search });
    setSweets(res.data);
  };

  const tabs = [
    { key: 'buy', label: '🛒 Buy' },
    { key: 'search', label: '🔍 Search' }
  ];

  return (
    <div
      className="user-bg"
      style={{
        backgroundImage: `url(${userBg})`,
        backgroundSize: 'cover',
        minHeight: '100vh'
      }}
    >
      <DashboardNavbar title="User Dashboard" tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="page-content container">

        {!activeTab && <div className="card"><h3>Choose an option above</h3></div>}

        {activeTab === 'buy' && (
          <div className="grid">
            {sweets.map(s => (
              <div key={s._id} className="sweet-card">
                <h3>{s.name}</h3>
                <p>{s.category} | ₹{s.price} | Qty: {s.quantity}</p>
                <button disabled={s.quantity < 1} onClick={() => purchase(s._id)}>
                  {s.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'search' && (
          <>
            <div className="card">
              <h3>Search Sweets</h3>
              <input placeholder="Name" value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })} />
              <input placeholder="Category" value={search.category} onChange={e => setSearch({ ...search, category: e.target.value })} />
              <input type="number" placeholder="Min Price" value={search.minPrice} onChange={e => setSearch({ ...search, minPrice: e.target.value })} />
              <input type="number" placeholder="Max Price" value={search.maxPrice} onChange={e => setSearch({ ...search, maxPrice: e.target.value })} />
              <button onClick={searchSweets}>Search</button>
            </div>

            <div className="grid">
              {sweets.map(s => (
                <div key={s._id} className="sweet-card">
                  <h3>{s.name}</h3>
                  <p>{s.category} | ₹{s.price} | Qty: {s.quantity}</p>
                  <button disabled={s.quantity < 1} onClick={() => purchase(s._id)}>
                    {s.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
