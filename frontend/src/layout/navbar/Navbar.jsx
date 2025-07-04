import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaClipboardList,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/authSlice";
import { fetchCart } from "../../redux/reducers/cartSlice";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.userMenuWrapper}`)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const CartIcon = () => (
  <div
    style={{ position: "relative", cursor: "pointer" }}
    onClick={() => navigate("/cart")}
  >
    <FaShoppingCart title="Səbət" />
    {totalQuantity > 0 && (
      <span className={styles.cartCount}>{totalQuantity}</span>
    )}
  </div>
);


  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.logoContainer}>
            <h2 className={styles.logoTop}>Recipes</h2>
            <h1 className={styles.logoMain}>
              <span>EASYMEALS</span>
              <div
                className={styles.burger}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </div>
            </h1>
          </div>
        </div>

        {/* Mobil ikonlar */}
        <div className={styles.iconRow}>
          <FaHeart title="Favoritlər" onClick={() => navigate("/favorites")} />
          <FaClipboardList title="Bişirəcəyəm" onClick={() => navigate("/to-cook-list")} />
          <CartIcon />
          <div className={styles.userMenuWrapper}>
            <FaUser
              title={user ? "Profilim" : "Daxil ol / Qeydiyyat"}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={styles.userIcon}
            />
            <div
              className={`${styles.userDropdown} ${userMenuOpen ? styles.show : ""}`}
            >
              {!user ? (
                <>
                  <Link to="/login">Daxil ol</Link>
                  <Link to="/register">Qeydiyyat</Link>
                </>
              ) : (
                <>
                  <Link to="/profile">Profilim ({user.role})</Link>
                  <button onClick={handleLogout}>Çıxış</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop menyular */}
        <div className={`${styles.navRow} ${menuOpen ? styles.showMenu : ""}`}>
          <div className={styles.leftIcons}>
            <FaHeart title="Favoritlər" onClick={() => navigate("/favorites")} />
            <FaClipboardList title="Bişirəcəyəm" onClick={() => navigate("/to-cook-list")} />
            <CartIcon />
            <div className={styles.userMenuWrapper}>
              <FaUser
                title={user ? "Profilim" : "Daxil ol / Qeydiyyat"}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={styles.userIcon}
              />
              <div
                className={`${styles.userDropdown} ${userMenuOpen ? styles.show : ""}`}
              >
                {!user ? (
                  <>
                    <Link to="/login">Daxil ol</Link>
                    <Link to="/register">Qeydiyyat</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile">Profilim ({user.role})</Link>
                    <button onClick={handleLogout}>Çıxış</button>
                  </>
                )}
              </div>
            </div>
          </div>

          <ul className={styles.navLinks}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/recipes">Recipes</Link></li>

            {user?.role === "user" && (
              <>
                <li><Link to="/add-recipe">Add Recipe</Link></li>
                <li><Link to="/user/recipes">My Recipes</Link></li>
                <li><Link to="/favorites">Favorilərim</Link></li>
                <li><Link to="/to-cook-list">Bişirəcəyəm</Link></li>
              </>
            )}

            {user?.role === "seller" && (
              <>
                <li><Link to="/add-product">Add Product</Link></li>
                <li><Link to="/my-products">My Products</Link></li>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <li><Link to="/admin/add-category">Add Category</Link></li>
                <li><Link to="/admin/add-location">Add Location</Link></li>
              </>
            )}
            <Link to="/seller/orders">Sifarişlərim</Link>

          </ul>

          <div className={styles.rightIcons}>
            <FaSearch title="Axtar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
