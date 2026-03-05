import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import google.generativeai as genai
from dotenv import load_dotenv

# setting up api keys
load_dotenv()

SPOTIPY_CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')
SPOTIPY_REDIRECT_URI = os.getenv('SPOTIPY_REDIRECT_URI')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

# spotify auth
scope = "user-top-read"
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=SPOTIPY_CLIENT_ID,
    client_secret=SPOTIPY_CLIENT_SECRET,
    redirect_uri=SPOTIPY_REDIRECT_URI,
    scope=scope
))

def get_roast():
    # pulling top 5 artists
    top_artists = sp.current_user_top_artists(limit=5, time_range='medium_term')
    artist_names = [artist['name'] for artist in top_artists['items']]
    
    # prompt for the model
    prompt = f"Act as a pretentious indian music critic. Roast this person based on their top 5 artists: {', '.join(artist_names)}. Be brutally honest and funny."
    
    response = model.generate_content(prompt)
    print("\n🔥 THE ROAST 🔥\n")
    print(response.text)

if __name__ == "__main__":
    get_roast()