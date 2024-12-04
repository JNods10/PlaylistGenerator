# Job analyzer related routes

from flask import Blueprint, request, jsonify

musicDetails = Blueprint("musicDetails", __name__)

@musicDetails.route("/musicDetails", methods=["POST"])
def analyze():
    # Extract input from the request
    data = request.json
    genre = data.get("genre", [])
    occasion = data.get("occasion", "")
    length = data.get("length", 0)


    results = [
  { "genre": genre, "occasion": occasion, "length": length}
]
    

    return jsonify({"results": results})