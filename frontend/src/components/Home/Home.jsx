import React from 'react'
import styles from './Home.module.css';
import { useNavigate } from "react-router-dom";


export const Home = () => {
  const navigate = useNavigate();
  return (
    <section className = {styles.container}>
        <h1 className = {styles.title}>Welcome to the custom playlist generator!</h1>
        <p className = {styles.tagline}>

        Boost your music listening experience with a custom playlist tailored 
        to your occasion, vibe, and more!

        </p>

        <div className={styles.cardContainer}>
            <div className = {styles.card} onClick={() => navigate("/musicDetails")}>
              <img src={process.env.PUBLIC_URL + "/assets/hero/musicClef.jpg"} alt="cardImage" />
              <h2 className = {styles.cardTitle}>Personalized Playlists</h2>
              <ul className = {styles.cardDescription}> 
                <li>Create playlists tailored to your preferences.</li>
                <li>Filter the songs based on mood, activity, and more!</li>
              </ul>
            </div>

            <div className = {styles.card} onClick={() => navigate("/musicDetails")}>
              <img src={process.env.PUBLIC_URL +"/assets/hero/aiCartoon.jpg"} alt="cardImage"/>
              <h2 className = {styles.cardTitle}>AI Integration</h2>
              <ul className = {styles.cardDescription}> 
                <li>AI technology to recommend songs and 
                  artists you might enjoy.
                </li>
                <li>Discover new music based on previous 
                  history.
                </li>
              </ul>
            </div>

            <div className = {styles.card} onClick={() => navigate("/musicDetails")}>
              <img src={process.env.PUBLIC_URL + "/assets/hero/handShake.jpg"} alt="cardImage"/>
              <h2 className = {styles.cardTitle}>Share and Download</h2>
              <ul className = {styles.cardDescription} > 
                <li>Share playlists with friends and family.
                </li>
                <li>Integrate your new playlist onto spotify!</li>
               
              </ul>
            </div>
        </div>

        <div className={styles.customCarouselContainer}>
        <h1 className = {styles.title}>Testimonials</h1>

        <div id="carouselExample" className={`carousel slide ${styles['custom-carousel']}`}>
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src={process.env.PUBLIC_URL + "/assets/hero/handShake.jpg"}  alt="..." />
    </div>
    <div className="carousel-item">
      <img src={process.env.PUBLIC_URL + "/assets/hero/handShake.jpg"}  alt="..." />
    </div>
    <div className="carousel-item">
      <img src={process.env.PUBLIC_URL +  "/assets/hero/handShake.jpg"}  alt="..." />
    </div>
  </div>
  <button
    className="carousel-control-prev"
    type="button"
    data-bs-target="#carouselExample"
    data-bs-slide="prev"
  >
    <span className={`carousel-control-prev-icon ${styles["carousel-control-prev-icon"]}`} aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button
    className="carousel-control-next"
    type="button"
    data-bs-target="#carouselExample"
    data-bs-slide="next"
  >
    <span className={`carousel-control-next-icon ${styles["carousel-control-next-icon"]}`} aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
</div>
    </section>
  )
}
