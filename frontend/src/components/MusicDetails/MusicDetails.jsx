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



  // Handle redirect from Spotify (exchange code for token)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const fetchToken = async () => {
        try {
          const tokenResponse = await getToken(code);
          saveToken(tokenResponse);
          urlParams.delete('code');
          window.history.replaceState({}, document.title, `${window.location.pathname}?${urlParams.toString()}`);
        } catch (error) {
          console.error('Error exchanging code for token:', error);
          setError('Failed to retrieve access token');
        }
      };
      fetchToken();
    }
  }, [getToken, saveToken]);
  
  useEffect(() => {
    if (currentToken?.access_token && isTokenValid() && !userData) {
      setLoading(true);
      setError(null);
      const fetchData = async () => {
        try {
          const data = await getUserData();
          setUserData(data);
  
          const artists = await getFollowArtists();
          setFollowArtists(artists);
  
          const tracks = await getTopTracks();
          setTopTracks(tracks);
  
          const playlists = await getPlaylists();
          setPlaylists(playlists);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [currentToken, userData, isTokenValid, getUserData, getFollowArtists, getTopTracks, getPlaylists]); // Dependencies to monitor

   // Handle logout
   const handleLogout = () => {
    logoutClick();
    setUserData(false); // Set loggedOut to true after logout
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
           <button type="button" className="btn btn-outline-success" onClick={loginWithSpotifyClick}>Connect Spotify</button>
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
          {/* Artists I Follow */}

            <div className={styles.userMetadataContent}>
              <button
                className={styles.revealUserDataButton}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTopArtists"
                aria-expanded="false"
                aria-controls="collapseTopArtists"
              >
                Artists I follow
              </button>
              <div>
                <div className="collapse collapse-horizontal" id="collapseTopArtists">
                  {followArtists?.artists?.items?.length > 0 && (
                    <ul className={styles.rankingList}>
                      {followArtists.artists.items.map((artist, index) => (
                        <li key={index} className={styles.rankingItem}>
                          <span style={{ fontWeight: 'bold' }}>{artist.name}</span>
                          {artist.images[0] && (
                            <img
                              src={artist.images[0].url}
                              alt={artist.name}
                              style={{
                                width: `${artist.images[0].width * 0.25}px`, // Adjusted scaling
                                height: `${artist.images[0].height * 0.25}px`,
                                borderRadius: '50%',
                              }}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

          {/* My Top Items */}
          <div className={styles.userMetadataContent}>
          <button
                className={styles.revealUserDataButton}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTopTracks"
                aria-expanded="false"
                aria-controls="collapseTopTracks"
              >
                My Top Tracks
              </button>

              <div className="collapse collapse-horizontal" id="collapseTopTracks">
            {/* Add corresponding content for My Top Items here */}
            {topTracks?.items?.length > 0 && (
              <ul className={styles.rankingList}>
                {topTracks.items.map((track, index) => (
                  <li key={index} className={styles.rankingItem}>
                    <span style={{fontWeight: "bold"}}>{track.name}</span>
                    {track.album.images && track.album.images.length > 0 && track.album.images[0] && (
                      <img 
                      src={track.album.images[0].url}
                      alt={track.name}
                      style={{
                        width:  `${track.album.images[0].width * 0.25}px`, // Scaled Width
                        height: `${track.album.images[0].height * 0.25}px`, // Scaled Height
                       
                      }}
                      className={styles.rankingItemImage}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
            </div>
          </div>

          {/* My Playlists */}
          <div className={styles.userMetadataContent}>
          <button
                className={styles.revealUserDataButton}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapsePlaylists"
                aria-expanded="false"
                aria-controls="collapsePlaylists"
              >
                My Playlists
              </button>
            {/* Add corresponding content for Artists I Follow here */}
            <div className="collapse collapse-horizontal" id="collapsePlaylists">
            {playlists?.items?.length > 0 && (
              <ul className={styles.rankingList}>
                {playlists.items.map((playlist, index) => (
                  <li key={index} className={styles.rankingItem}>
                    <span style={{fontWeight: "bold"}}>{playlist.name}</span>
                    {playlist.images && playlist.images.length > 0 && playlist.images[0] && (
                      <img 
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      style={{
                        width:  `${playlist.images[0].width * 0.25}px`, // Scaled Width
                        height: `${playlist.images[0].height * 0.25}px`, // Scaled Height
                       
                      }}
                      className={styles.rankingItemImage}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          </div>
        </div>
      )}
    </div>
            <MusicDetailsForm />      
    </div>
  );
};