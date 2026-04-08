import os
import httpx
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from google import genai
from dotenv import load_dotenv

#loadting api keys
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv() # Also check current directory

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the environment")

#connecting genai client
client = genai.Client(api_key=GEMINI_API_KEY)

#initiating fast api
app = FastAPI()

#allowing frontend to connect with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000","https://roastify-inky.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#initiating fast api
@app.get("/roast")
async def get_roast(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No Spotify Token provided")
    
    #fetching top artists
    async with httpx.AsyncClient() as http_client:
        spotify_res = await http_client.get(
            "https://api.spotify.com/v1/me/top/artists?limit=5",
            headers={"Authorization": authorization}
        )
        
        if spotify_res.status_code != 200:
            print(f"Spotify API Error: {spotify_res.status_code} - {spotify_res.text}")
            raise HTTPException(status_code=400, detail=f"Failed to fetch Spotify data: {spotify_res.text}")
        
        data = spotify_res.json()
        artists = [artist['name'] for artist in data['items']]

    #generating roast
    prompt = f"""
    Act as a peak "South Delhi/South Bombay" music snob. You are insufferable, elite, and think anyone who listens to mainstream music is a "NPC" with zero personality. Your job is to brutally roast a user based on their Top 5 artists: {', '.join(artists)}.

    Strict Guidelines:
    1. Tone: Condescending, witty, and judgmental. Use a mix of "Simple English" and "Savage Hindi" (Hinglish).
    2. Style: Use simple words but sharp, biting insults. Avoid being "nice" or "supportive."
    3. Format: 
       - A 1-sentence "drive-by" roast for each of the 5 artists.
       - A final "Overall Verdict" on their entire existence as a music listener.
    4. Length: Keep it under 200 words.
    5. Language: Use conversational Hinglish (e.g., "Yaar, please," "Have some standards," "Thoda toh original bano").

    Output should be in JSON format:
    {{
        "roast": "your brutal roast here",
        "badge": "A 2-3 word insulting title (e.g., 'NPC Main Character', 'Wannabe Intellectual', 'Bollywood Junkie')",
        "rating": <A number from 1 to 5, where 1 is absolute trash and 5 is 'bearable' - though you should almost never give a 5>
    }}
    """

    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
        }
    )

    import json
    result = json.loads(response.text)

    return {"artists": artists, **result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))

