import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from '../layout/Layout';
import Register from '../pages/register/Register';
import Login from '../pages/login/Login';
import Profile from '../pages/profile/Profile';
import VerifyEmail from '../pages/verifyemail/VerifyEmail';
import ForgotPassword from '../pages/forgotpassword/ForgotPassword';
import ResetPassword from '../pages/resetpassword/ResetPassword';
import Home from '../pages/home/Home';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home/>} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verify/:token" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
