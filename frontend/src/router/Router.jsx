import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "../layout/Layout";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import VerifyEmail from "../pages/verifyemail/VerifyEmail";
import ForgotPassword from "../pages/forgotpassword/ForgotPassword";
import ResetPassword from "../pages/resetpassword/ResetPassword";
import Home from "../pages/home/Home";
import AddRecipe from "../pages/addrecipe/AddRecipe";
import Recipes from "../pages/recipes/Recipes";
import CookMode from "../pages/cookmode/CookMode";
import MyRecipes from "../pages/myrecipes/MyRecipes";
import EditRecipe from "../pages/editrecipe/EditRecipe";
import Favorites from "../pages/favorites/Favorites";
import ToCookList from "../pages/tocooklist/ToCookList";
import AddCategory from "../pages/categories/AddCategory";
import AddProduct from "../pages/addproduct/AddProduct";
import Shop from "../pages/shop/Shop";
import ProductDetails from "../pages/productdetails/ProductDetails";
import MyProducts from "../pages/myproducts/MyProducts";
import EditProduct from "../pages/editproducts/EditProduct";
import AddLocation from "../pages/admin/addlocation/AddLocation";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Cart from "../pages/cart/Cart";
import CheckoutForm from "../pages/checkout/CheckoutForm";
import Success from "../pages/success/Success";
import Cancel from "../pages/cancel/Cancel";
import MyOrders from "../pages/myorders/MyOrders";
import AllOrders from "../pages/admin/allorders/AllOrders";
import SellerOrders from "../pages/sellerorders/SellerOrders";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/cook-mode/:id" element={<CookMode />} />
          <Route path="/user/recipes" element={<MyRecipes />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/to-cook-list" element={<ToCookList />} />
          <Route path="/admin/add-category" element={<AddCategory />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/cart" element={<Cart />} /> 
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/add-location" element={<AddLocation />} />
          <Route
            path="/admin/add-category"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-location"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddLocation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-products"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <MyProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-recipe"
            element={
              <ProtectedRoute>
                <AddRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/recipes"
            element={
              <ProtectedRoute>
                <MyRecipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-recipe/:id"
            element={
              <ProtectedRoute>
                <EditRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/to-cook-list"
            element={
              <ProtectedRoute>
                <ToCookList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutForm />
              </ProtectedRoute>
            }
          />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerOrders />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
