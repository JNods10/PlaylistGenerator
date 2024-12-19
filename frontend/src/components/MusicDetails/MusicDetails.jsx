import React, { useEffect, useState } from 'react';
import MusicDetailsForm from "./MusicDetailsForm/MusicDetailsForm";
import styles from "./MusicDetails.module.css";
import { useSpotifyAuth } from "../../spotifyAuth";


export const MusicDetails = () => {
  const { loginWithSpotifyClick, logoutClick, isTokenValid, getUserData, getFollowArtists, getTopTracks, getPlaylists, currentToken, getToken, saveToken } = useSpotifyAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);  // Loading state for fetching user data
  const [error, setError] = useState(null); // Error state for handling fetch issues
  const [followArtists, setFollowArtists] = useState(0); // Users top Spotify items
  const [topTracks, setTopTracks] = useState(0); // Users top tracks
  const [playlists, setPlaylists] = useState(0); // Users playlists 
  const [artistSwitch, setArtistSwitch] = useState(false); // Boolean for if to display following artists
  const [trackSwitch, setTrackSwitch] = useState(false);  // Boolean for if to display top tracks
  const [playlistSwitch, setPlaylistSwitch] = useState(false);  // Boolean for if to display playlists

  // Handle redirect from Spotify (exchange code for token)
  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // Get the authorization code from the URL
    if (code) {
      console.log(code);
      const fetchToken = async () => {
        try {
          const tokenResponse = await getToken(code); // Exchange code for tokens
          saveToken(tokenResponse); // Save token (in localStorage or context)
          console.log(tokenResponse);
          // Clean up the URL to remove "code" after we have stored it
          urlParams.delete('code');
          window.history.replaceState({}, document.title, `${window.location.pathname}?${urlParams.toString()}`);
        } catch (error) {
          console.error('Error exchanging code for token:', error);
          setError('Failed to retrieve access token');
        }
      };

      fetchToken();
    }

    // Fetch user data once the token is available and valid
  if (currentToken?.access_token && isTokenValid() && !userData) {
    console.log("Fetching user data...");
    setLoading(true);
    setError(null);

    const fetchUserData = async () => {
      try {
        const data = await getUserData();  // Get user data from Spotify
        setUserData(data);  // Update state with fetched user data
      } catch (err) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }



  }, [currentToken, getToken, saveToken, getUserData, isTokenValid, userData]); // Dependencies to monitor


  const handleFollowArtists = async () =>
  {
    const artists = await getFollowArtists();
    setArtistSwitch(!artistSwitch)
    if (artists && artistSwitch)
    {
      setFollowArtists(artists);
    }
  };

  
  const handleTopTracks = async () =>
    {
      const tracks = await getTopTracks();
      setTrackSwitch(!trackSwitch)
      if (tracks && trackSwitch)
      {
        setTopTracks(tracks);
      }
    };

    const handlePlaylists = async () =>
    {
      const playlists = await getPlaylists();
      setPlaylistSwitch(!playlistSwitch)
      if (playlists && playlistSwitch)
      {
        setPlaylists(playlists)
      }
    };
  
  return (
    <div className={styles.container}>
      {/* Show login button if there's no access token */}
      {!currentToken?.access_token ? (
           <>
           <img
           
             className={styles.spotifyLogo} src={process.env.PUBLIC_URL + "/assets/musicDetailsPage/Spotify_Primary_Logo_RGB_Green.png"}
             alt="Spotify Logo"
           />
           <button type="button" class="btn btn-outline-success" onClick={loginWithSpotifyClick}>Connect Spotify</button>
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
              <strong>Email:</strong> {userData ? userData.email : 'Loading...'}
            </p>
            <p className={styles.userData}>
              <strong>Spotify ID:</strong> {userData ? userData.id : 'Loading...'}
            </p>
            <button
              type="button"
              className="btn btn-outline-success logout-button"
              onClick={logoutClick}
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
        <div className={styles.buttonRow}>
          {/* Artists I Follow */}
          <div className={styles.buttonContent}>
            <button
              onClick={handleFollowArtists}
              type="button"
              className="btn btn-outline-success"
            >
              Artists I Follow
            </button>
            {followArtists?.artists?.items?.length > 0 && artistSwitch && (
              <ul className={styles.artistList}>
                {followArtists.artists.items.map((artist, index) => (
                  <li key={index} className={styles.artistItem}>
                    <span>{artist.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* My Top Items */}
          <div className={styles.buttonContent}>
            <button
              onClick={(handleTopTracks)}
              type="button"
              className="btn btn-outline-success"
            >
              My Top Tracks
            </button>
            {/* Add corresponding content for My Top Items here */}
            {topTracks?.items?.length > 0 && trackSwitch && (
              <ul className={styles.artistList}>
                {topTracks.items.map((track, index) => (
                  <li key={index} className={styles.artistItem}>
                    <span>{track.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* My Playlists */}
          <div className={styles.buttonContent}>
            <button
              onClick= {handlePlaylists}
              type="button"
              className="btn btn-outline-success"
            >
              My Playlists
            </button>
            {/* Add corresponding content for Artists I Follow here */}
            {playlists?.items?.length > 0 && playlistSwitch && (
              <ul className={styles.artistList}>
                {playlists.items.map((playlist, index) => (
                  <li key={index} className={styles.artistItem}>
                    <span>{playlist.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
            <MusicDetailsForm />      
    </div>
  );
};