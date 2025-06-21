import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/authSlice.js';

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
      {!isAuthenticated && <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>}
      {!isAuthenticated && <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>}
      {isAuthenticated && <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link>}
      <Link to="/forgot-password" style={{ marginRight: '10px' }}>Forgot Password</Link>
      {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
};

export default Navbar;

