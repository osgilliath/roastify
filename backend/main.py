import os
import httpx
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from google import genai
from dotenv import load_dotenv

#loadting api keys
load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

#connecting genai client
client = genai.Client(api_key=GEMINI_API_KEY)

#initiating fast api
app = FastAPI()

#allowing frontend to connect with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],
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
            "http://googleusercontent.com/api.spotify.com/v1/me/top/artists?limit=5",
            headers={"Authorization": authorization}
        )
        
        if spotify_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch Spotify data")
        
        data = spotify_res.json()
        artists = [artist['name'] for artist in data['items']]

    #generating roast
    prompt = f"""
    Act as a peak "South Delhi/South Bombay" music snob. You are insufferable, elite, and think anyone who listens to mainstream music is a "NPC" with zero personality. Your job is to brutally roast a user based on their Top 5 artists: {', '.join(track_names)}.

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

    return {"artists": artists, "roast": response.text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

