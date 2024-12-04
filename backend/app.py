from flask import Flask
from flask_cors import CORS
from routes.musicDetailsRoute import musicDetails

app = Flask(__name__)
CORS(app) # Enable CORS for cross-origin communication

app.register_blueprint(musicDetails, url_prefix="/api")

@app.route('/')
def home():
    return {"message": "Welcome to the Playlist Generator"}

if __name__ == '__main__':
    app.run(debug=True)
