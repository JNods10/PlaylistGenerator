import React, { useEffect, useState } from 'react'
import MusicDetailsForm from './MusicDetailsForm/MusicDetailsForm'
import styles from './MusicDetails.module.css'
import { useSpotifyAuth } from '../../spotifyAuth'

export const MusicDetails = () => {
  const {
    loginWithSpotifyClick,
    logoutClick,
    isTokenValid,
    getUserData,
    getFollowArtists,
    getTopTracks,
    getPlaylists,
    currentToken,
    getToken,
    saveToken,
  } = useSpotifyAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [followArtists, setFollowArtists] = useState(0)
  const [topTracks, setTopTracks] = useState(0)
  const [playlists, setPlaylists] = useState(0)

  // Handle redirect from Spotify (exchange code for token)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      const fetchToken = async () => {
        try {
          const tokenResponse = await getToken(code)
          saveToken(tokenResponse)
          urlParams.delete('code')
          window.history.replaceState(
            {},
            document.title,
            `${window.location.pathname}?${urlParams.toString()}`
          )
        } catch (error) {
          console.error('Error exchanging code for token:', error)
          setError('Failed to retrieve access token')
        }
      }
      fetchToken()
    }
  }, [getToken, saveToken])

  useEffect(() => {
    if (currentToken?.access_token && isTokenValid() && !userData) {
      setLoading(true)
      setError(null)
      const fetchData = async () => {
        try {
          const data = await getUserData()
          setUserData(data)

          const artists = await getFollowArtists()
          setFollowArtists(artists)

          const tracks = await getTopTracks()
          setTopTracks(tracks)

          const playlists = await getPlaylists()
          setPlaylists(playlists)
        } catch (err) {
          console.error('Error fetching user data:', err)
          setError('Failed to fetch user data')
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [
    currentToken,
    userData,
    isTokenValid,
    getUserData,
    getFollowArtists,
    getTopTracks,
    getPlaylists,
  ])

  // Handle logout
  const handleLogout = () => {
    logoutClick()
    setUserData(false)
  }

  return (
    <div className={styles.container}>
      {/* Show login button if there's no access token */}
      {!currentToken?.access_token ? (
        <>
          <img
            className={styles.spotifyLogo}
            src={
              process.env.PUBLIC_URL +
              '/assets/musicDetailsPage/Spotify_Primary_Logo_RGB_Green.png'
            }
            alt='Spotify Logo'
          />
          <button
            type='button'
            className='btn btn-outline-success'
            onClick={loginWithSpotifyClick}
          >
            Connect Spotify
          </button>
        </>
      ) : (
        <div className={styles.userInfoContainer}>
          {loading ? (
            <p className={styles.loadingMessage}>Loading user data...</p>
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : (
            <div className={styles.userDetails}>
              <h2>Your Spotify Account is Connected!</h2>
              <p className={styles.userData}>
                <strong>Email:</strong>{' '}
                {userData ? userData.email : 'Loading...'}
              </p>
              <p className={styles.userData}>
                <strong>Spotify ID:</strong>{' '}
                {userData ? userData.id : 'Loading...'}
              </p>
              <button
                type='button'
                className='btn btn-outline-success logout-button'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      <div className={styles.userAPICalls}>
        {!currentToken?.access_token ? (
          <p>Please log in to access your Spotify features.</p>
        ) : (
          <div className={styles.userMetadata}>
            <h1 className={styles.sectionTitle}>Your Music Library</h1>

            {/* Artists Section */}
            <div className={styles.metadataSection}>
              <div className={styles.sectionHeader}>
                <h2>Artists You Follow</h2>
                <p className={styles.sectionSubtitle}>
                  Your favorite artists and bands
                </p>
              </div>
              <div className={styles.contentGrid}>
                {followArtists?.artists?.items?.map((artist, index) => (
                  <div key={index} className={styles.artistCard}>
                    <div className={styles.artistImage}>
                      {artist.images[0] && (
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className={styles.artistImg}
                        />
                      )}
                    </div>
                    <div className={styles.artistInfo}>
                      <h3>{artist.name}</h3>
                      <p className={styles.artistType}>{artist.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Tracks Section */}
            <div className={styles.metadataSection}>
              <div className={styles.sectionHeader}>
                <h2>Your Top Tracks</h2>
                <p className={styles.sectionSubtitle}>Your most played songs</p>
              </div>
              <div className={styles.contentGrid}>
                {topTracks?.items?.map((track, index) => (
                  <div key={index} className={styles.trackCard}>
                    <div className={styles.trackImage}>
                      {track.album.images[0] && (
                        <img
                          src={track.album.images[0].url}
                          alt={track.name}
                          className={styles.trackImg}
                        />
                      )}
                    </div>
                    <div className={styles.trackInfo}>
                      <h3>{track.name}</h3>
                      <p className={styles.trackArtist}>
                        {track.artists[0].name}
                      </p>
                      <p className={styles.trackAlbum}>{track.album.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Playlists Section */}
            <div className={styles.metadataSection}>
              <div className={styles.sectionHeader}>
                <h2>Your Playlists</h2>
                <p className={styles.sectionSubtitle}>Your custom playlists</p>
              </div>
              <div className={styles.contentGrid}>
                {playlists?.items?.map((playlist, index) => (
                  <div key={index} className={styles.playlistCard}>
                    <div className={styles.playlistImage}>
                      {playlist.images[0] && (
                        <img
                          src={playlist.images[0].url}
                          alt={playlist.name}
                          className={styles.playlistImg}
                        />
                      )}
                    </div>
                    <div className={styles.playlistInfo}>
                      <h3>{playlist.name}</h3>
                      <p className={styles.playlistTracks}>
                        {playlist.tracks.total} tracks
                      </p>
                      <p className={styles.playlistOwner}>
                        By {playlist.owner.display_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <MusicDetailsForm />
    </div>
  )
}
