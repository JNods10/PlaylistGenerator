from openai import OpenAI
from pydantic import BaseModel

from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

import os

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("The OpenAI key is not set.  Please configure it as an environment variable.")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

class playlistItem(BaseModel):
    songName: str
    artist: str

class playlist(BaseModel):
    songs: list[playlistItem]



def generate_playlist(user_input):
    # Construct the prompt for the AI model
    prompt = f"""
    Generate a playlist of 10 popular {user_input["genre"]} songs for fans to enjoy.
    Customize the playlist so that is fits the theme of a {user_input["occasion"]}.
    Make sure the playlist is only the size of {user_input["length"]} songs.
    """


    try:
        # Generate the response
       completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "user", "content": prompt}
        ],
        response_format=playlist,
        )
       
       generated_text = completion.choices[0].message.parsed

       # Parse the generated text into a list
    #    playlist = [line.strip() for line in generated_text.split("\n") if line.strip()]
       return generated_text

    except Exception as e:
        raise RuntimeError(f"AI model error: {str(e)}")