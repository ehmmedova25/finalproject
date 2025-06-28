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
import AddRecipe from '../pages/addrecipe/AddRecipe';
import Recipes from '../pages/recipes/Recipes';
import CookMode from "../pages/cookmode/CookMode"; 
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
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path='/recipes' element={<Recipes/>}/>
          <Route path="/cook-mode/:id" element={<CookMode />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
