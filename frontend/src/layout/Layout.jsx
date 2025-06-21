import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import React from 'react';

export default function Layout() {
  return (
    <>
      <Navbar />
       <Outlet /> 
    </>
  );
}
