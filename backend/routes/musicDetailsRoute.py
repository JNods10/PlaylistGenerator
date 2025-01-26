from flask import Blueprint, request, jsonify
from models.analyzer import generate_playlist


playlistBP = Blueprint("playlist", __name__)

# Handle playlist generation
@playlistBP.route("/generate_playlist_route", methods=["POST"])
def generate_playlist_route():
    try:
        print("request received")
        # Parse the JSON data received from the generate playlist form
        data = request.get_json()
        if not data or "genre" not in data:
            return jsonify({"error": "Invalid Input"})
        
        user_data = data

        # Generate the playlist using the AI model

        playlist = generate_playlist(user_data)
        playlist_dict = {}
        for song in playlist.songs:
            # print("Song: ",type(song), "\n")
            print("Song Name: ", song.songName)  
            print("Artist: ", song.artist)
            playlist_dict[song.songName] = song.artist
        return playlist_dict
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500