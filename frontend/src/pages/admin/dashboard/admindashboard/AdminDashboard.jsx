
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../../components/admins/Sidebar'; 

const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7f9fc' }}>
      <Sidebar />

<div style={{ marginLeft: '230px', padding: '0px 10px 10px 30px', flex: 1 }}>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
 