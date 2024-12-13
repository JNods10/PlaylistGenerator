import React, { useEffect, useState } from 'react';
import MusicDetailsForm from "./MusicDetailsForm/MusicDetailsForm";
import styles from "./MusicDetails.module.css";
import { useSpotifyAuth } from "../../spotifyAuth";


export const MusicDetails = () => {
  const { loginWithSpotifyClick, logoutClick, isTokenValid, getUserData, currentToken, getToken, saveToken } = useSpotifyAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);  // Loading state for fetching user data
  const [error, setError] = useState(null); // Error state for handling fetch issues
  const [loggedIn, setLoggedIn] = useState(false);

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
        console.log(data.email);
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

  
  return (
    <div className={styles.container}>
      <MusicDetailsForm />
      <h1>Music Details</h1>

      {/* Show login button if there's no access token */}
      {!currentToken?.access_token ? (
        <button onClick={loginWithSpotifyClick}>Login with Spotify</button>
      ) : (
        <div>
          {/* Conditional rendering based on loading and errors */}
          {loading ? (
            <p>Loading user data...</p>  // Loading message
          ) : error ? (
            <p>{error}</p>  // Show error message if there's an issue fetching data
          ) : (
            <div>
              <h2>Welcome!</h2>
              <p>Email: {userData ? userData.email : 'Loading...'}</p>
              <p>Spotify ID: {userData ? userData.id : 'Loading...'}</p>
              <button onClick={logoutClick}>Logout</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};