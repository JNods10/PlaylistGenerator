import React, { useState, useRef, useEffect } from 'react'
import styles from './MusicDetailsForm.module.css'
import { findSong, addSongToPlaylist, createPlaylist } from './createPlaylist'
import { useSpotifyAuth } from '../../../spotifyAuth'
// import WebPlayback from './WebPlayback';

export const MusicDetailsForm = () => {
  const [genre, setGenre] = useState('')
  const [occasion, setOccasion] = useState('')
  const [length, setLength] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [playlistID, setPlaylistID] = useState(null)
  const [playlistName, setPlaylistName] = useState('')

  const [failedSongs, setFailedSongs] = useState([])

  const loadingRef = useRef(null)

  const { currentToken, getUserData, isTokenValid } = useSpotifyAuth()

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  const handlePlayButtonClick = () => {
    console.log('hello play button')
  }

  const handleCreatePlaylist = async () => {
    if (!isTokenValid()) {
      console.error('Token is invalid or expired.')
      return
    }

    const accessToken = currentToken.access_token
    if (!accessToken) {
      console.log('Access token is missing.')
      return
    }

    try {
      const userData = await getUserData()
      const userID = userData.id

      const response = await createPlaylist(accessToken, userID, playlistName)
      console.log(`Playlist ${response.name} created succesfully.`)
      await delay(4000) 
      setPlaylistID(response.id)

      const newPlaylistID = response.id;
      console.log("Playlist ID: ",playlistID)

      handleAddSongPlaylist(newPlaylistID);
    } catch (error) {
      console.error('Error creating the playlist', error.message)
    }
  }

  const handleAddSongPlaylist = async (newPlaylistID) => {
    if (!isTokenValid) {
      console.error('Token is invalid or expired.')
      return
    }

    const accessToken = currentToken.access_token
    if (!accessToken) {
      console.log('Access token is missing.')
      return
    }

    const failed = [] // Temp array for failed songs

    try {
      console.log("Results: :",results)
      for (const [song, artist] of Object.entries(results)) {
        const searchResults = await findSong(accessToken, artist, song) // results of artist and song name
        console.log('Was the song found?: ', searchResults.status)
        const items = searchResults.data.tracks.items // all items returned from Spotify API search
        let songID = '' // Spotify ID of the song
        
        console.log("Items Length ", items.length);
        
        for (const item of items) {
          songID = item.id


          const response = await addSongToPlaylist(
            accessToken,
            newPlaylistID,
            songID
          )

          // Check if the operation was successful
          if (!response.ok) {
            console.log('There was an error while adding song to playlist')
            console.log('Response Object:', response)
            failed.push({
              song: item.name,
              artist: item.artist,
              error: response.statusText,
            })
          } else {
            console.log('Song added successfully:', response.status, song)
          }

          await delay(2000)
        }
      }
    } catch (error) {
      console.error('Error adding song to the playlist', error.message)
    } finally {
      setFailedSongs(failed) // Update the state with failed songs
    }
    console.log("Failed Songs: ", failedSongs);
  
  }

  useEffect(() => {
    if (loading) {
      loadingRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [loading])

  const handleSubmit = async e => {
    e.preventDefault() // Prevents the default browser behavior of refreshing the page when the form is submitted.

    setLoading(true)
    setFailedSongs([])
    setResults(null)
    setError(false)
    setPlaylistID(null)
    // Data to send to the Flask backend
    const payload = { genre, occasion, length }

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/api/generate_playlist_route',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        setError(true)
        throw new Error('Failed to generate the playlist')
      }

      const data = await response.json()
      setResults(data) // Update state when received from the backend
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setError(true)
    }
  }

  return (
    <div className='container mt-5'>
      <h2 className='text-center mb-4'>Playlist Form</h2>
      <form
        onSubmit={handleSubmit}
        className='p-4 border rounded shadow-sm bg-light'
      >
        {/* Playlist Name */}
        <div className='mb-3'>
          <label htmlFor='playlistName' className='form-label'>
            Playlist Name
          </label>
          <input
            type='text'
            className='form-control'
            id='genre'
            name='genre'
            value={playlistName}
            onChange={e => setPlaylistName(e.target.value)}
            placeholder='Enter the desired name of your playlist'
            required
          />
        </div>

        {/* Genre Input */}
        <div className='mb-3'>
          <label htmlFor='genre' className='form-label'>
            Genre
          </label>
          <input
            type='text'
            className='form-control'
            id='genre'
            name='genre'
            value={genre}
            onChange={e => setGenre(e.target.value)}
            placeholder='Enter your Genre (e.g., Rap, Rock, Jazz)'
            required
          />
        </div>

        {/* Occasion */}
        <div className='mb-3'>
          <label htmlFor='occasion' className='form-label'>
            Occasion
          </label>
          <input
            type='text'
            className='form-control'
            id='occasion'
            name='occasion'
            value={occasion}
            onChange={e => setOccasion(e.target.value)}
            placeholder='Enter your field of interest (e.g., Web Development)'
            required
          />
        </div>

        {/* Length */}
        <div className='mb-3'>
          <label htmlFor='length' className='form-label'>
            Length
          </label>
          <input
            type='text'
            className='form-control'
            id='length'
            name='length'
            value={length}
            onChange={e => setLength(e.target.value)}
            placeholder='Enter how many songs you want in the playlist'
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className={`btn btn-primary ${styles['custom-submit-btn']} w-100`}
        >
          Design Your Playlist
        </button>
      </form>

      {/* Display results (for testing purposes) */}

      {/* Loading section */}

      <div
        ref={loadingRef}
        className={`${styles.loading} ${loading ? styles.loading : styles.hideLoading}`}
      >
        <h3>Loading the playlist...</h3>
        <div className={styles.loader}></div>
      </div>

      {/* Results*/}

      {results && (
        <div>
          {error ? (
            <h1>Playlist Failed to generate</h1>
          ) : (
            Object.keys(results).length > 0 && (
              <div>
                <h3>Songs</h3>
                <ul className={styles.playlistContainer}>
                  {Object.entries(results).map(([song, artist], index) => (
                    <li className={styles.playlistItem} key={index}>
                      <strong>{song}</strong> by {artist}
                      <button
                        className={styles.glightbox_video}
                        onClick={handlePlayButtonClick}
                      >
                        <svg
                          width='50'
                          height='50'
                          viewBox='0 0 131 131'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            className={styles.inner_circle}
                            d='M65 21C40.1488 21 20 41.1488 20 66C20 90.8512 40.1488 111 65 111C89.8512 111 110 90.8512 110 66C110 41.1488 89.8512 21 65 21Z'
                            fill='green'
                          ></path>
                          <circle
                            className={styles.outer_circle}
                            cx='65.5'
                            cy='65.5'
                            r='64'
                            stroke='black'
                          ></circle>
                          <path
                            className={styles.play}
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M60 76V57L77 66.7774L60 76Z'
                            fill='white'
                          ></path>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type='button'
                  className={styles.createPlaylistButton}
                  onClick={handleCreatePlaylist}
                >
                  Create Playlist
                </button>

                {/* <div>
              <WebPlayback/>
            </div> */}
              </div>
            )
          )}
          {failedSongs.length > 0 && (
            <div className='mt-4'>
              <h4 className='text-danger'>Failed to Add Songs:</h4>
              <ul>
                {failedSongs.map(({ song, artist, error }, index) => (
                  <li key={index}>
                    <strong>{song}</strong> by {artist} - Error: {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MusicDetailsForm
