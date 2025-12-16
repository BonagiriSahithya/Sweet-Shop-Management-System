import React, { useState, useEffect } from 'react';
import API from '../api';
import DashboardNavbar from './DashboardNavbar';
import userBg from '../assets/bg/user-bg.jpg';

export default function UserDashboard() {
  const [sweets, setSweets] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [search, setSearch] = useState({ name: '', category: '', minPrice: '', maxPrice: '' });

  useEffect(() => { fetchSweets(); }, []);

  const fetchSweets = async (params = {}) => {
    const res = await API.get('/sweets/search', { params });
    setSweets(res.data);
  };

  const purchase = async id => {
    await API.put(`/sweets/purchase/${id}`);
    fetchSweets(search);
  };

  const handleSearch = e => setSearch({ ...search, [e.target.name]: e.target.value });

  const performSearch = () => {
    const params = {};
    if (search.name) params.name = search.name;
    if (search.category) params.category = search.category;
    if (search.minPrice) params.minPrice = search.minPrice;
    if (search.maxPrice) params.maxPrice = search.maxPrice;
    fetchSweets(params);
  };

  const tabs = [
    { key: 'buy', label: '🛒 Buy Sweets' },
    { key: 'search', label: '🔍 Search Sweets' },
  ];

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

        {activeTab === 'search' && (
          <div className="card">
            <h3>Search Sweets</h3>
            <input name="name" placeholder="Name" value={search.name} onChange={handleSearch} />
            <input name="category" placeholder="Category" value={search.category} onChange={handleSearch} />
            <input name="minPrice" type="number" placeholder="Min Price" value={search.minPrice} onChange={handleSearch} />
            <input name="maxPrice" type="number" placeholder="Max Price" value={search.maxPrice} onChange={handleSearch} />
            <button onClick={performSearch}>Search</button>

            <div className="grid" style={{ marginTop: '20px' }}>
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
          </div>
        )}
      </div>
    </div>
  );
}
