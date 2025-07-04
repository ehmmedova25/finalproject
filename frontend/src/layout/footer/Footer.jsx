import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.column}>
          <img
            src="https://i0.wp.com/easymeals.ie/wp-content/uploads/2025/02/EasyMeals-ie.png?fit=500%2C500&ssl=1"
            alt="EasyMeals Logo"
            className={styles.logo}
          />
          <p>
            EasyMeals – Evdə bişirilən yeməklər üçün platforma. Reseptlər, sifarişlər və yerli dadlar bir arada.
          </p>
        </div>

        <div className={styles.column}>
          <h4>Keçidlər</h4>
          <Link to="/">Ana Səhifə</Link>
          <Link to="/recipes">Reseptlər</Link>
          <Link to="/shop">Mağaza</Link>
          <Link to="/favorites">Favorilərim</Link>
          <Link to="/cooklist">Bişirəcəyəm</Link>
        </div>

        <div className={styles.column}>
          <h4>Haqqımızda</h4>
          <Link to="/about">Biz Kimik?</Link>
          <Link to="/contact">Əlaqə</Link>
          <Link to="/terms">İstifadə Şərtləri</Link>
          <Link to="/privacy">Məxfilik Siyasəti</Link>
        </div>

        <div className={styles.column}>
          <h4>Əlaqə</h4>
          <p><FaMapMarkerAlt /> Bakı, Azərbaycan</p>
          <p><FaEnvelope /> info@easymeals.az</p>
          <p><FaPhoneAlt /> +994 50 123 45 67</p>
          <div className={styles.socials}>
            <a href="https://facebook.com" target="_blank"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} EasyMeals •  Made by Gul❤️</p>
      </div>
    </footer>
  );
};

export default Footer;
