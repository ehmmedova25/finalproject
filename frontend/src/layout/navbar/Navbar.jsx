import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/authSlice"; 
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.logoContainer}>
            <h2 className={styles.logoTop}>Recipes</h2>
            <h1 className={styles.logoMain}>
              <span>EASYMEALS</span>
              <div className={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes /> : <FaBars />}
              </div>
            </h1>
          </div>
        </div>

        <div className={styles.iconRow}>
          <FaHeart title="Favoritlər" />
          <FaShoppingCart title="Səbət" />
          <div className={styles.userMenuWrapper}>
            <FaUser
              title={user ? "Profilim" : "Daxil ol / Qeydiyyat"}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={styles.userIcon}
            />
            {userMenuOpen && (
              <div className={styles.userDropdown}>
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setUserMenuOpen(false)}>Daxil ol</Link>
                    <Link to="/register" onClick={() => setUserMenuOpen(false)}>Qeydiyyat</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}>Profilim</Link>
                    <button onClick={handleLogout}>Çıxış</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.navRow} ${menuOpen ? styles.showMenu : ''}`}>
          <div className={styles.leftIcons}>
            <FaHeart title="Favoritlər" />
            <FaShoppingCart title="Səbət" />
            {/* Sol tərəfdə sadəcə ikon, dropdown yoxdur */}
            <FaUser title="Profil" />
          </div>

          <ul className={styles.navLinks}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/recipes">Recipes</Link></li>
            <li><Link to="/forum">Forum</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
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
