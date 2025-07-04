import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import { Outlet } from "react-router-dom"; 
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import VerifyEmail from "../pages/verifyemail/VerifyEmail";

import Home from "../pages/home/Home";
import Recipes from "../pages/recipes/Recipes";
import Shop from "../pages/shop/Shop";
import ProductDetails from "../pages/productdetails/ProductDetails";
import Cart from "../pages/cart/Cart";
import Success from "../pages/success/Success";
import CookMode from "../pages/cookmode/CookMode";
import EditRecipe from "../pages/admin/editrecipe/EditRecipe";
import ResetPassword from "../pages/resetpassword/ResetPassword"; 
import ForgotPassword from "../pages/forgotpassword/ForgotPassword";

import Profile from "../pages/profile/Profile";
import MyOrders from "../pages/admin/dashboard/myorders/MyOrders";
import Favorites from '../pages/favorites/Favorites'
import CookList from "../pages/tocooklist/ToCookList";
import CheckoutForm from "../pages/checkout/CheckoutForm"; 

import AdminDashboard from "../pages/admin/dashboard/admindashboard/AdminDashboard";
import DashboardHome from "../pages/admin/dashboard/DashboardHome";
import AddProduct from "../pages/admin/addproduct/AddProduct";
import AddRecipe from "../pages/admin/addrecipe/AddRecipe";
import AddCategory from "../pages/admin/addcategory/AddCategory";
import AddLocation from "../pages/admin/addlocation/AddLocation";
import MyRecipes from "../pages/admin/myrecipes/MyRecipes";
import AllOrders from "../pages/admin/dashboard/allorders/AllOrders";
import AllUsers from "../pages/admin/allusers/AllUsers"; 
import MyProducts from "../pages/admin/myproducts/MyProducts";
import EditProduct from "../pages/admin/editproduct/EditProduct"; 
import BestSellersAdmin from "../pages/admin/bestsellersadmin/BestSellersAdmin";
import BannerManagement from "../pages/admin/bannermanagement/BannerManagement";
import CategoryPage from "../pages/category/CategoryPage";
import CategoryManagement from "../pages/admin/categorymanagement/CategoryManagement";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verify/:token" element={<VerifyEmail />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="success" element={<Success />} />
          <Route path="cook-mode/:id" element={<CookMode />} />
          <Route path="checkout" element={<CheckoutForm />} />
          <Route path="category/:categoryName" element={<CategoryPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />

          <Route
  path="/profile"
  element={
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <Profile />
    </ProtectedRoute>
  }
/>

<Route
  path="/favorites"
  element={<ProtectedRoute allowedRoles={["user"]}><Favorites /></ProtectedRoute>}
/>
<Route
  path="/cooklist"
  element={<ProtectedRoute allowedRoles={["user"]}><CookList /></ProtectedRoute>}
/>
<Route
  path="/my-orders"
  element={<ProtectedRoute allowedRoles={["user"]}><MyOrders /></ProtectedRoute>}
/>


          <Route
            path="dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="add-recipe" element={<AddRecipe />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="add-location" element={<AddLocation />} />
            <Route path="my-recipes" element={<MyRecipes />} />
            <Route path="my-products" element={<MyProducts />} />
            <Route path="all-orders" element={<AllOrders />} />
            <Route path="all-users" element={<AllUsers />} />
            <Route path="edit-recipe/:id" element={<EditRecipe />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="bestsellers" element={<BestSellersAdmin />} />
            <Route path="banner-management" element={<BannerManagement />} />
            <Route path="manage-categories" element={<CategoryManagement />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
