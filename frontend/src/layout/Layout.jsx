import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from '../redux/reducers/authSlice';
import Footer from './footer/Footer';

export default function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}

      {isDashboard && (
        <div style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
          <Link to="/" style={{ textDecoration: "underline", color: "#007bff" }}>
            ← Ana səhifəyə qayıt
          </Link>
        </div>
      )}

      <Outlet />
      <Footer/>
    </>
  );
}
