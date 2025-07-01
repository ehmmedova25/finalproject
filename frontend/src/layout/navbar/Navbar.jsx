import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
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

  // Dropdowndan çöldə klik ediləndə bağlansın
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.userMenuWrapper}`)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* Mobil görünüşdə */}
        <div className={styles.iconRow}>
          <FaHeart title="Favoritlər" />
          <FaShoppingCart title="Səbət" />
          <div className={styles.userMenuWrapper}>
            <FaUser
              title={user ? "Profilim" : "Daxil ol / Qeydiyyat"}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={styles.userIcon}
            />
            <div
              className={`${styles.userDropdown} ${
                userMenuOpen ? styles.show : ""
              }`}
            >
              {!user ? (
                <>
                  <Link to="/login">Daxil ol</Link>
                  <Link to="/register">Qeydiyyat</Link>
                </>
              ) : (
                <>
                  <Link to="/profile">Profilim</Link>
                  <button onClick={handleLogout}>Çıxış</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop görünüşü */}
        <div className={`${styles.navRow} ${menuOpen ? styles.showMenu : ""}`}>
          <div className={styles.leftIcons}>
            <FaHeart title="Favoritlər" />
            <FaShoppingCart title="Səbət" />
            <div className={styles.userMenuWrapper}>
              <FaUser
                title={user ? "Profilim" : "Daxil ol / Qeydiyyat"}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={styles.userIcon}
              />
              <div
                className={`${styles.userDropdown} ${
                  userMenuOpen ? styles.show : ""
                }`}
              >
                {!user ? (
                  <>
                    <Link to="/login">Daxil ol</Link>
                    <Link to="/register">Qeydiyyat</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile">Profilim</Link>
                    <button onClick={handleLogout}>Çıxış</button>
                  </>
                )}
              </div>
            </div>
          </div>

          <ul className={styles.navLinks}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/recipes">Recipes</Link>
            </li>
            <li>
<Link to="/add-recipe">add recipe</Link>

            </li>
            <li>
<Link to="/user/recipes">My recipes</Link>

            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
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
