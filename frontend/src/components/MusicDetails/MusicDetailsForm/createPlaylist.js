const spotifyApiBase = "https://api.spotify.com/v1/";


export async function createPlaylist(accessToken, userID, playlistName) {
    const url = `${spotifyApiBase}users/${userID}/playlists`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",

        },
        body: JSON.stringify({
            name: playlistName,
            description: "Custom Playlist",
            public: false
        }),

    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating playlist:', errorData);
        throw new Error("Failed to create the playlist")
    }
    return response.json();
}

export async function addSongToPlaylist(accessToken, playlist_id, songID) 
{
    playlist_id = String(playlist_id);
    const url = `${spotifyApiBase}playlists/${playlist_id}/tracks`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",

        },
        body: JSON.stringify({
            uris: [
                `spotify:track:${songID}`
            ],
            position: 0
        }),

    });

      // Log the entire response object for debugging
      console.log("Response object:", response);

      if (!response.ok) {
          // Log detailed error information
          try {
              const errorData = await response.json();
              console.error("Error adding song to playlist:", errorData);
          } catch (parseError) {
              console.error("Failed to parse error response:", parseError);
          }
          throw new Error("Failed to add song to the playlist");
      }
      const data = await response.json();

      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
    };

    // {
    //     "uris": [
    //         "string"
    //     ],
    //     "position": 0
    // }
}

export async function findSong(accessToken, artist, title)
{

    const query = `track:${encodeURIComponent(title)} artist:${encodeURIComponent(artist)}`;
    const url = `${spotifyApiBase}search?q=${query}&type=track&limit=1`;

    const response = await fetch(url,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
       
    );

    const data = await response.json();



    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

    else
    {


      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
    };
    }

}