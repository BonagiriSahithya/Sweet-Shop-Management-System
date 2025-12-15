import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ role }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2>🍬 Sweet Shop</h2>
      </div>
      <div className="navbar-right">
        {role && (
          <>
            <span>{role.toUpperCase()}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
