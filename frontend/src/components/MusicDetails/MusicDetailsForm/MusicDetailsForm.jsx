
import React, { useState } from 'react'
import styles from "./MusicDetailsForm.module.css";

export const MusicDetailsForm = () => {

    const [genre, setGenre] = useState('');
    const [occasion, setOccasion] = useState('');
    const [length, setLength] = useState('');
    const [results, setResults] = useState([]);
  
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevents the default browser behavior of refreshing the page when the form is submitted.
  
      // Data to send to the Flask backend
      const payload = { genre, occasion, length };
  
      try {
        const response = await fetch('http://127.0.0.1:5000/api/musicDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
        setResults(data.musicDetails); // Update state when received from the backend
      } catch (error) {
        console.error('Error:', error);
      }
    };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Playlist Form</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        {/* Genre Input */}
        <div className="mb-3">
          <label htmlFor="genre" className="form-label">
            Genre
          </label>
          <input
            type="text"
            className="form-control"
            id="genre"
            name="genre"
            value={genre}
            onChange= {(e) => setGenre(e.target.value)}
            placeholder="Enter your Genre (e.g., Rap, Rock, Jazz)"
            required
          />
        </div>

        {/* Occasion */}
        <div className="mb-3">
          <label htmlFor="occasion" className="form-label">
            Occasion
          </label>
          <input
            type="text"
            className="form-control"
            id="occasion"
            name="occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="Enter your field of interest (e.g., Web Development)"
            required
          />
        </div>

        {/* Length */}
        <div className="mb-3">
          <label htmlFor="length" className="form-label">
            Length
          </label>
          <input
            type="text"
            className="form-control"
            id="length"
            name="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Enter your desired location (e.g., Dallas, TX)"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className={`btn btn-primary ${styles['custom-submit-btn']} w-100`}>
          Design Your Playlist
        </button>
      </form>

      {/* Display results (for testing purposes) */}

      {/* {results && (
      <div>
      <h3>Songs</h3>
      <ul>
        {results.map((musicDetails,index) => (
          <li key={index}>
            {musicDetails.genre} {musicDetails.occasion}, {musicDetails.length}
          </li>
        ))}
      </ul>
      </div>
    )} */}

    </div>




    
  );
};


export default MusicDetailsForm;