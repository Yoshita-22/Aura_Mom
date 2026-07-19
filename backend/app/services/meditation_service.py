import os
import json
import base64
from typing import List
from pydantic import BaseModel
from google import genai
from hume import HumeClient

class ScriptLine(BaseModel):
    time: int
    text: str
    audio_base64: str

class MeditationResponse(BaseModel):
    script: List[ScriptLine]

class MeditationService:
    def __init__(self):
        self.gemini_client = genai.Client(api_key=os.getenv("MEDITATION_GEMINI_KEY"))
        self.hume_client = HumeClient(api_key=os.getenv("HUME_API_KEY"))
        self.voice_id = os.getenv("HUME_VOICE_ID")

    def _generate_script(self, feeling: str, bothers: List[str], pregnancy_month: int) -> List[dict]:
        prompt = f"""
You are AuraMom's empathetic prenatal meditation guide.
Create a beautifully paced, 2-minute guided meditation script.

User Profile:
- Pregnancy Month: {pregnancy_month}
- Current Feeling: {feeling}
- Current Bothers: {", ".join(bothers)}

Instructions:
1. Provide an array of script lines with the exact 'time' (in seconds) they should be spoken.
2. The times should range from 0 to about 105 seconds.
3. Leave long, comfortable pauses (e.g. 15-20 seconds) between each spoken line so the mother can relax and reflect in silence.
4. Keep the tone warm, soothing, empowering, and maternal.
5. Acknowledge their current feelings gently.
6. Address their bothers directly but positively, helping them release them.
7. IMPORTANT: Write a FULL, UNIQUE script (6 to 8 lines total). DO NOT literally output the example below.

Return ONLY a valid JSON array of objects with 'time' (integer) and 'text' (string). No markdown, no explanation.

Example format (Do NOT copy this, write your own full script):
[
  {{ "time": 0, "text": "Welcome, mama. Find a comfortable position and close your eyes." }},
  {{ "time": 15, "text": "Breathe in deeply... and let it go..." }}
]
"""
        response = self.gemini_client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
        )

        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()

        script = json.loads(response_text)
        return script

    def _generate_audio(self, script_text: str) -> str:
        audio_bytes = bytearray()
        for chunk in self.hume_client.tts.synthesize_file(
            utterances=[{'text': script_text, 'voice': {'id': self.voice_id}}]
        ):
            audio_bytes.extend(chunk)
        
        return base64.b64encode(audio_bytes).decode('utf-8')

    def generate_meditation(self, feeling: str, bothers: List[str], pregnancy_month: int) -> MeditationResponse:
        # 1. Generate the timed script array
        script_arr = self._generate_script(feeling, bothers, pregnancy_month)
        
        # 2. Generate audio for each line separately to allow long pauses between them
        final_script = []
        for line in script_arr:
            audio_b64 = self._generate_audio(line["text"])
            final_script.append(ScriptLine(
                time=line["time"],
                text=line["text"],
                audio_base64=audio_b64
            ))
        
        return MeditationResponse(
            script=final_script
        )
