import React, { useState, useEffect } from 'react';
import API from '../api';
import DashboardNavbar from './DashboardNavbar';
import adminBg from '../assets/bg/admin-bg.jpg';

export default function AdminDashboard() {
  const [sweets, setSweets] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', price: '', quantity: '' });
  const [search, setSearch] = useState({ name: '', category: '', minPrice: '', maxPrice: '' });

  useEffect(() => { fetchSweets(); }, []);

  const fetchSweets = async (params = {}) => {
    const res = await API.get('/sweets/search', { params });
    setSweets(res.data);
  };

  const addSweet = async () => {
    await API.post('/sweets', form);
    setForm({ name: '', category: '', price: '', quantity: '' });
    fetchSweets();
  };

  const restock = async id => {
    const qty = prompt('Enter quantity');
    if (qty) { await API.put(`/sweets/restock/${id}`, { quantity: qty }); fetchSweets(); }
  };

  const remove = async id => {
    if (window.confirm('Delete sweet?')) { await API.delete(`/sweets/${id}`); fetchSweets(); }
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
    { key: 'add', label: '➕ Add' },
    { key: 'manage', label: '⚙ Manage' },
    { key: 'search', label: '🔍 Search' },
  ];

  return (
    <div
      className="admin-bg"
      style={{
        backgroundImage: `url(${adminBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
    >
      <DashboardNavbar title="Admin Dashboard" tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="page-content container">
        {!activeTab && (
          <div className="card">
            <h3 style={{ textAlign: 'center' }}>Select an operation above</h3>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="card">
            <h3>Add Sweet</h3>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            <button onClick={addSweet}>Add Sweet</button>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="grid">
            {sweets.map(s => (
              <div key={s._id} className="sweet-card">
                <h3>{s.name}</h3>
                <p>{s.category} | ${s.price} | Qty: {s.quantity}</p>
                <div className="card-buttons">
                  <button onClick={() => restock(s._id)}>Restock</button>
                  <button onClick={() => remove(s._id)}>Delete</button>
                </div>
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
                  <div className="card-buttons">
                    <button onClick={() => restock(s._id)}>Restock</button>
                    <button onClick={() => remove(s._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
