from flask import Flask
from flask_cors import CORS
from routes.musicDetailsRoute import playlistBP
import os

app = Flask(__name__)
CORS(app)
app.secret_key = "7b93b435b24c4cd8b38d188bd5b334e3"

# Register your blueprint
app.register_blueprint(playlistBP, url_prefix="/api")

if __name__ == "__main__":
    # Use the port provided by Render or default to 5000 for local testing
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)