import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import authBg from '../assets/bg/auth-bg.jpg';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      navigate(res.data.role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      alert(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${authBg})`,
      backgroundSize: 'cover',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div className="auth-card">
        <Navbar />
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Signup</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
