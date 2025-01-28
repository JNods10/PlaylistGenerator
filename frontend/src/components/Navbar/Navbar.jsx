import styles from "./Navbar.module.css";
import { useState } from "react";
import { Link} from 'react-router-dom';

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

  return (
     <nav className={styles.navbar}>
        <div className={styles.menu}>
            <img 
            className={styles.menuBtn}
            src={
                menuOpen
                ? "assets/nav/closeIcon.png"
                : "assets/nav/menuIcon.png"
            }
            alt="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            />
            <ul 
            className={`${styles.menuItems} ${menuOpen ? styles.menuOpen : ''}`}
            onClick= {() => setMenuOpen(false)}
            >
            <li>
            <Link to="/">Home</Link> {/* Using Link to navigate */}
            </li>
            <li>
            <Link to="/musicDetails">Generate Playlist</Link> {/* Using Link to navigate */}
          </li>
              {/* <li>
                <Link to="/about">About</Link> 
              </li> */}

            </ul>

        </div>
            <div className={styles.navbarTitle}>
             <h1 className={styles.title}>Playlist Generator</h1>
            </div>

        
     </nav>

  )
}
