import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  FaTachometerAlt,
  FaPlus,
  FaUtensils,
  FaList,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaUsers,
  FaFire,
  FaImage,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    product: false,
    recipe: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        EasyMeals<span>.</span>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/dashboard/admin" className={styles.link}>
          <FaTachometerAlt /> <span>Dashboard</span>
        </NavLink>

        <div className={styles.dropdown}>
          <div
            onClick={() => toggleMenu("product")}
            className={styles.dropdownToggle}
          >
            <FaBoxOpen />
            <span>Product Management</span>
            {openMenus.product ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {openMenus.product && (
            <div className={styles.submenu}>
              <NavLink
                to="/dashboard/admin/add-product"
                className={styles.link}
              >
                ➕ Məhsul əlavə et
              </NavLink>
              <NavLink
                to="/dashboard/admin/my-products"
                className={styles.link}
              >
                📦 Məhsullarım
              </NavLink>
            </div>
          )}
        </div>

        <div className={styles.dropdown}>
          <div
            onClick={() => toggleMenu("recipe")}
            className={styles.dropdownToggle}
          >
            <FaUtensils />
            <span>Recipe Management</span>
            {openMenus.recipe ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {openMenus.recipe && (
            <div className={styles.submenu}>
              <NavLink to="/dashboard/admin/add-recipe" className={styles.link}>
                Resept əlavə et
              </NavLink>
              <NavLink to="/dashboard/admin/my-recipes" className={styles.link}>
                {" "}
                Reseptlərim
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/dashboard/admin/add-category" className={styles.link}>
          <FaList /> <span>Kateqoriya əlavə et</span>
        </NavLink>
        <NavLink to="/dashboard/admin/add-location" className={styles.link}>
          <FaMapMarkerAlt /> <span>Yer əlavə et</span>
        </NavLink>
        <NavLink to="/dashboard/admin/all-orders" className={styles.link}>
          <FaList /> <span>Bütün sifarişlər</span>
        </NavLink>
        <NavLink to="/dashboard/admin/all-users" className={styles.link}>
          <FaUsers /> <span>İstifadəçilər</span>
        </NavLink>
        <NavLink to="/dashboard/admin/bestsellers" className={styles.link}>
          <FaFire /> <span> Ən Çox Satılanlar</span>
        </NavLink>
        <NavLink
          to="/dashboard/admin/banner-management"
          className={styles.link}
        >
          <FaImage /> <span> Banner İdarəetməsi</span>
        </NavLink>
        <NavLink
          to="/dashboard/admin/manage-categories"
          className={styles.link}
        >
          <FaList /> <span>Kateqoriyaları İdarə Et</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
