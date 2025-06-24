import styles from "./Navbar.module.css"
import { Search, ShoppingBag } from "lucide-react"
import React from "react"

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.socialIcons}>
          <a href="#" className={styles.socialLink}>
            f
          </a>
          <a href="#" className={styles.socialLink}>
            𝕏
          </a>
          <a href="#" className={styles.socialLink}>
            @
          </a>
          <a href="#" className={styles.socialLink}>
            B'
          </a>
          <a href="#" className={styles.socialLink}>
            P
          </a>
        </div>

        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <img
              src=''
              alt="Watercolor vegetables illustration"
              className={styles.illustration}
            />
            <div className={styles.brandText}>
         
              <h1 className={styles.brandName}>laHanna</h1>  
                 <p className={styles.tagline}>ALWAYS COOKING SOMETHING</p>
            </div>
          </div>
        </div>

        <div className={styles.rightIcons}>
          <button className={styles.iconButton}>
            <ShoppingBag size={20} />
          </button>
          <button className={styles.iconButton}>
            <Search size={20} />
          </button>
        </div>
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li>
            <a href="#" className={styles.navLink}>
              HOME
            </a>
          </li>
          <li>
            <a href="#" className={styles.navLink}>
              RECIPES
            </a>
          </li>
          <li>
            <a href="#" className={styles.navLink}>
              FEATURES
            </a>
          </li>
          <li>
            <a href="#" className={styles.navLink}>
              SHOP
            </a>
          </li>
          <li>
            <a href="#" className={styles.navLink}>
              ABOUT ME
            </a>
          </li>
          <li>
            <a href="#" className={styles.navLink}>
              CONTACT
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
