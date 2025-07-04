// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaClipboardList,
  FaShoppingCart,
  FaUser,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaGlobe,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/authSlice";
import { fetchCart } from "../../redux/reducers/cartSlice";
import axiosInstance from "../../api/axiosInstance";
import styles from "./Navbar.module.css";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const { user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuOpen && !e.target.closest(`.${styles.wrapper}`)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menuOpen]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Kateqoriyalar alınmadı:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLanguageOpen(false);
    setMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setCategoriesOpen(false);
    setUserMenuOpen(false);
    setLanguageOpen(false);
  };

  const dashboardPath =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "user"
      ? "/dashboard/user"
      : "/";

  const CartIcon = () => (
    <div className={styles.cartIcon} onClick={() => navigate("/cart")}>
      <FaShoppingCart title={t("cart")} />
      {totalQuantity > 0 && <span className={styles.cartCount}>{totalQuantity}</span>}
    </div>
  );

  const currentLang = i18n.language?.toUpperCase() || "EN";

  return (
    <nav className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" onClick={closeMobileMenu}>
            <img
              src="https://i0.wp.com/easymeals.ie/wp-content/uploads/2025/02/EasyMeals-ie.png?fit=500%2C500&ssl=1"
              alt="EasyMeals Logo"
            />
          </Link>
        </div>

        {menuOpen && <div className={styles.overlay} onClick={closeMobileMenu}></div>}

        <div className={`${styles.links} ${menuOpen ? styles.showMenu : ""}`}>
          <Link to="/" onClick={closeMobileMenu}>
            {t("home")}
          </Link>
          <Link to="/recipes" onClick={closeMobileMenu}>
            {t("recipes")}
          </Link>
          <Link to="/shop" onClick={closeMobileMenu}>
            {t("shop")}
          </Link>

          <div className={styles.dropdown}>
            <button 
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className={styles.dropdownButton}
            >
              {t("categories")} <FaChevronDown className={categoriesOpen ? styles.rotate : ""} />
            </button>
            {categoriesOpen && (
              <div className={styles.dropdownMenu}>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.name.toLowerCase()}`}
                    onClick={closeMobileMenu}
                  >
                    {cat.icon && <span className={styles.categoryIcon}>{cat.icon}</span>} 
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {user?.role === "admin" && (
            <Link to={dashboardPath} onClick={closeMobileMenu}>
              {t("dashboard")}
            </Link>
          )}

          {/* Mobile Icons */}
          <div className={styles.mobileIcons}>
            <div className={styles.mobileIcon} onClick={() => { navigate("/cooklist"); closeMobileMenu(); }}>
              <FaClipboardList />
              <span>{t("cooklist")}</span>
            </div>
            
            <div className={styles.mobileIcon} onClick={() => { navigate("/cart"); closeMobileMenu(); }}>
              <FaShoppingCart />
              <span>{t("cart")}</span>
              {totalQuantity > 0 && <span className={styles.mobileBadge}>{totalQuantity}</span>}
            </div>

            {/* Mobile User Menu */}
            <div className={styles.mobileUserMenu}>
              <div 
                className={styles.mobileIcon} 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <FaUser />
                <span>{t("account")}</span>
                <FaChevronDown className={userMenuOpen ? styles.rotate : ""} />
              </div>
              {userMenuOpen && (
                <div className={styles.mobileUserDropdown}>
                  {!user ? (
                    <>
                      <Link to="/login" onClick={closeMobileMenu}>{t("login")}</Link>
                      <Link to="/register" onClick={closeMobileMenu}>{t("register")}</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" onClick={closeMobileMenu}>{t("profile")}</Link>
                      <Link to={dashboardPath} onClick={closeMobileMenu}>{t("dashboard")}</Link>
                      <button onClick={handleLogout}>{t("logout")}</button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className={styles.mobileLanguage}>
              <div 
                className={styles.mobileIcon} 
                onClick={() => setLanguageOpen(!languageOpen)}
              >
                <FaGlobe />
                <span>{currentLang}</span>
                <FaChevronDown className={languageOpen ? styles.rotate : ""} />
              </div>
              {languageOpen && (
                <div className={styles.mobileLanguageDropdown}>
                  <button 
                    onClick={() => handleLanguageChange("az")}
                    className={i18n.language === "az" ? styles.active : ""}
                  >
                    🇦🇿 Azərbaycan
                  </button>
                  <button 
                    onClick={() => handleLanguageChange("en")}
                    className={i18n.language === "en" ? styles.active : ""}
                  >
                    🇺🇸 English
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Icons */}
        <div className={styles.icons}>
          <FaClipboardList 
            title={t("cooklist")}
            onClick={() => navigate("/cooklist")} 
            className={styles.iconButton}
          />
          <CartIcon />

          <div className={styles.userMenu}>
            <FaUser 
              onClick={() => setUserMenuOpen(!userMenuOpen)} 
              className={styles.iconButton}
            />
            {userMenuOpen && (
              <div className={styles.userDropdown}>
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setUserMenuOpen(false)}>{t("login")}</Link>
                    <Link to="/register" onClick={() => setUserMenuOpen(false)}>{t("register")}</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}>{t("profile")}</Link>
                    <Link to={dashboardPath} onClick={() => setUserMenuOpen(false)}>{t("dashboard")}</Link>
                    <button onClick={handleLogout}>{t("logout")}</button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={styles.languageSwitcher}>
            <button 
              onClick={() => setLanguageOpen(!languageOpen)}
              className={styles.languageButton}
            >
              <FaGlobe />
              <span>{currentLang}</span>
              <FaChevronDown className={languageOpen ? styles.rotate : ""} />
            </button>
            {languageOpen && (
              <div className={styles.languageDropdown}>
                <button 
                  onClick={() => handleLanguageChange("az")}
                  className={i18n.language === "az" ? styles.active : ""}
                >
                  🇦🇿 AZ
                </button>
                <button 
                  onClick={() => handleLanguageChange("en")}
                  className={i18n.language === "en" ? styles.active : ""}
                >
                  🇺🇸 EN
                </button>
              </div>
            )}
          </div>

          <div className={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
