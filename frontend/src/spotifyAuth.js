import { useNavigate } from 'react-router-dom';

const clientID = "f46bb173a8274fd892cab3a6ce5c99ed";
// const redirectURL = "https://jnods10.github.io/PlaylistGenerator/#/musicDetails";
const redirectURL = "http://localhost:3000/musicDetails"; // dev redirect URL
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email user-top-read user-follow-read playlist-read-private playlist-modify-public playlist-modify-private';

export const useSpotifyAuth = () => {
  const navigate = useNavigate();

  const currentToken = {
    get access_token() { return sessionStorage.getItem('access_token') || null; },
    get refresh_token() { return sessionStorage.getItem('refresh_token') || null; },
    get expires_in() { return sessionStorage.getItem('expires_in') || null; },
    get expires() { return sessionStorage.getItem('expires') || null; },

    save: function (response) {
      const { access_token, refresh_token, expires_in } = response;
      sessionStorage.setItem('access_token', access_token);
      sessionStorage.setItem('refresh_token', refresh_token);
      sessionStorage.setItem('expires_in', expires_in);

      const now = new Date();
      const expiry = new Date(now.getTime() + (expires_in * 1000));
      sessionStorage.setItem('expires', expiry);
    }
  };

  const redirectToSpotifyAuthorize = async () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);

    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    window.localStorage.setItem('code_verifier', code_verifier);

    const authUrl = new URL(authorizationEndpoint);
    const params = {
      response_type: 'code',
      client_id: clientID,
      scope: scope,
      code_challenge_method: 'S256',
      code_challenge: code_challenge_base64,
      redirect_uri: redirectURL
    };

    console.log(params);

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  };

  const saveToken = (token) => {
    currentToken.save(token);
  }

  const getToken = async (code) => {
    try {
      // Retrieve the code_verifier from localStorage
      const codeVerifier = localStorage.getItem('code_verifier');
      if (!codeVerifier) {
        throw new Error('Missing code_verifier. Ensure it was stored during the authorization step.');
      }
  
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientID,          // Ensure clientId is defined in your scope
          grant_type: 'authorization_code',
          code,                        // Pass the authorization code from URL
          redirect_uri: redirectURL,   // Ensure redirectUri matches your Spotify app settings
          code_verifier: codeVerifier, // PKCE verifier for added security
        }),
      };
  
      const response = await fetch('https://accounts.spotify.com/api/token', payload);
  
      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Spotify API Error:', errorData);
        throw new Error(`Error fetching token: ${response.status} - ${errorData.error_description}`);
      }
  
      const data = await response.json();
  
      // Validate if the access_token is present
      if (!data.access_token) {
        throw new Error('Access token missing in response. Verify your request parameters.');
      }
  
      // Store the token and log success
      localStorage.setItem('access_token', data.access_token);
      console.log('Access token successfully retrieved and stored.');
      return data;
  
    } catch (error) {
      // Log errors for debugging
      console.error('Error during token retrieval:', error.message);
      throw error;
    }
  };


  const refreshToken = async () => {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientID,
        grant_type: 'refresh_token',
        refresh_token: currentToken.refresh_token
      }),
    });
  
    return await response.json();
  };

  const getUserData = async () => {
    console.log(currentToken.access_token);
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
    });
  
    return await response.json();
  };

  // get the artists that the user follows
  const getFollowArtists = async () =>
  {
    const response = await fetch("https://api.spotify.com/v1/me/following?type=artist", {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
    });
    return await response.json();
  }

 
 // get the users top 3 tracks

 const getTopTracks = async () => 
  {
  const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=5&offset=0", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
  });
  return await response.json();
 }

 // get the users playlists
 const getPlaylists = async () => 
  {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
    });
    return await response.json();

 }

  // Click handlers
  const loginWithSpotifyClick = async () => {
    await redirectToSpotifyAuthorize();
  };

  const logoutClick = () => {
    sessionStorage.clear();
    navigate(redirectURL); // Navigate to the specified URL after logout
  };

  const refreshTokenClick = async () => {
    const token = await refreshToken();
    currentToken.save(token);

  };

  const isTokenValid = () => {
    const expires = currentToken.expires;
    if (!expires) return false; // If there is not expires value

    const now = new Date();
    return new Date(expires) > now; // Check if the token is still valid
  }


  return {
    loginWithSpotifyClick,
    logoutClick,
    refreshTokenClick,
    getUserData,
    getToken,
    saveToken,
    isTokenValid,
    currentToken,
    getFollowArtists,
    getTopTracks,
    getPlaylists
  };
};