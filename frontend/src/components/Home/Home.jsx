import React from 'react'
import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate()
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        Welcome to the custom playlist generator!
      </h1>
      <p className={styles.tagline}>
        Boost your music listening experience with a custom playlist tailored to
        your occasion, vibe, and more!
      </p>

      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={() => navigate('/musicDetails')}>
          <img
            src={process.env.PUBLIC_URL + '/assets/hero/musicClef.jpg'}
            alt='cardImage'
          />
          <h2 className={styles.cardTitle}>Personalized Playlists</h2>
          <ul className={styles.cardDescription}>
            <li>Create playlists tailored to your preferences.</li>
            <li>Filter the songs based on mood, activity, and more!</li>
          </ul>
        </div>

        <div className={styles.card} onClick={() => navigate('/musicDetails')}>
          <img
            src={process.env.PUBLIC_URL + '/assets/hero/aiCartoon.jpg'}
            alt='cardImage'
          />
          <h2 className={styles.cardTitle}>AI Integration</h2>
          <ul className={styles.cardDescription}>
            <li>
              AI technology to recommend songs and artists you might enjoy.
            </li>
            <li>Discover new music based on previous history.</li>
          </ul>
        </div>

        <div className={styles.card} onClick={() => navigate('/musicDetails')}>
          <img
            src={process.env.PUBLIC_URL + '/assets/hero/handShake.jpg'}
            alt='cardImage'
          />
          <h2 className={styles.cardTitle}>Share and Download</h2>
          <ul className={styles.cardDescription}>
            <li>Share playlists with friends and family.</li>
            <li>Integrate your new playlist onto spotify!</li>
          </ul>
        </div>
      </div>

      <div className={styles.playlistsContainer}>
        <h1 className={styles.title}>Example Playlists</h1>
        <div className={styles.playlistsGrid}>
          <div className={styles.playlistCard}>
            <div className={styles.playlistContent}>
              <div className={styles.playlistImage}>
                <img
                  src={process.env.PUBLIC_URL + '/assets/hero/musicClef.jpg'}
                  alt='Workout Playlist'
                />
                <div className={styles.playlistOverlay}>
                  <span className={styles.playlistDuration}>45 min</span>
                </div>
              </div>
              <div className={styles.playlistInfo}>
                <h3>Power Workout Mix</h3>
                <div className={styles.playlistTags}>
                  <span className={styles.tag}>Genre: EDM, Hip-Hop</span>
                  <span className={styles.tag}>Occasion: Workout</span>
                </div>
                <p className={styles.playlistDescription}>
                  High-energy tracks perfect for your gym session. Features
                  motivational beats and powerful drops.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.playlistCard}>
            <div className={styles.playlistContent}>
              <div className={styles.playlistImage}>
                <img
                  src={process.env.PUBLIC_URL + '/assets/hero/aiCartoon.jpg'}
                  alt='Chill Vibes Playlist'
                />
                <div className={styles.playlistOverlay}>
                  <span className={styles.playlistDuration}>1h 20min</span>
                </div>
              </div>
              <div className={styles.playlistInfo}>
                <h3>Sunday Chill Vibes</h3>
                <div className={styles.playlistTags}>
                  <span className={styles.tag}>Genre: Lo-fi, Jazz</span>
                  <span className={styles.tag}>Occasion: Relaxation</span>
                </div>
                <p className={styles.playlistDescription}>
                  Smooth beats and mellow tunes for your lazy Sunday afternoon.
                  Perfect for reading or studying.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.playlistCard}>
            <div className={styles.playlistContent}>
              <div className={styles.playlistImage}>
                <img
                  src={process.env.PUBLIC_URL + '/assets/hero/handShake.jpg'}
                  alt='Party Mix Playlist'
                />
                <div className={styles.playlistOverlay}>
                  <span className={styles.playlistDuration}>2h 15min</span>
                </div>
              </div>
              <div className={styles.playlistInfo}>
                <h3>Weekend Party Mix</h3>
                <div className={styles.playlistTags}>
                  <span className={styles.tag}>Genre: Pop, Dance</span>
                  <span className={styles.tag}>Occasion: Party</span>
                </div>
                <p className={styles.playlistDescription}>
                  The ultimate party playlist with the latest hits and classic
                  dance tracks. Get the party started!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
