import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from google import genai
from dotenv import load_dotenv

# setting up api keys
load_dotenv()

SPOTIPY_CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')
SPOTIPY_REDIRECT_URI = os.getenv('SPOTIPY_REDIRECT_URI')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# genai client
client = genai.Client(api_key=GEMINI_API_KEY)

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
    prompt = f"""
    Act as a peak "South Delhi/South Bombay" music snob. You are insufferable, elite, and think anyone who listens to mainstream music is a "NPC" with zero personality. Your job is to brutally roast a user based on their Top 5 artists: {', '.join(artist_names)}.

    Strict Guidelines:
    1. Tone: Condescending, witty, and judgmental. Use a mix of "High-society English" and "Savage Hindi" (Hinglish).
    2. Logic:
       - If it's all Pop: Call them "basic" and "boring."
       - If it's all Indie: Call them a "pseudo-intellectual wannabe."
       - If it's all Bollywood: Tell them to "stop living in a Karan Johar movie."
       - If it's a mix: Accuse them of having a "multiple personality disorder."
    3. Style: Use simple words but sharp, biting insults. Avoid being "nice" or "supportive."
    4. Format: 
       - A 1-sentence "drive-by" roast for each of the 5 artists.
       - A final "Overall Verdict" on their entire existence as a music listener.
    5. Length: Keep it under 400 words.
    6. Language: Use conversational Hinglish (e.g., "Yaar, please," "Have some standards," "Thoda toh original bano").
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    print("\n THE ROAST! \n")
    print(response.text)

if __name__ == "__main__":
    get_roast()
