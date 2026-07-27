import os
import google.generativeai as genai
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Güvenli Nokta AI - Fotoğraf Analiz Servisi")

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("gemini-2.5-flash")


class PhotoAnalysisResult(BaseModel):
    riskAreas: List[str]
    safeSpots: List[str]
    suggestions: List[str]


PROMPT = """
Bu bir ev odası fotoğrafıdır. Deprem güvenliği açısından fotoğrafı incele.
Aşağıdaki üç başlık altında SADECE gözlemlediğin somut tespitleri listele:

1. riskAreas     → Riskli alanlar (örn: "Sabitlenmemiş kitaplık", "Cam kenarında koltuk")
2. safeSpots     → Güvenli noktalar (örn: "İç duvar kenarı", "Sağlam masa altı")
3. suggestions   → Öneriler (örn: "Kitaplığı duvara sabitle", "Koltuku camdan uzaklaştır")

Cevabı JSON formatında ver:
{
  "riskAreas": ["..."],
  "safeSpots": ["..."],
  "suggestions": ["..."]
}
Yalnızca JSON döndür, başka metin ekleme.
"""


@app.get("/health")
def health():
    return {"status": "ok", "service": "Güvenli Nokta AI - Fotoğraf Servisi"}


@app.post("/analyze-image", response_model=PhotoAnalysisResult)
async def analyze_image(image: UploadFile = File(...)):
    # Dosya türü kontrolü
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Yalnızca görsel dosyası kabul edilir.")

    image_bytes = await image.read()

    # Gemini Vision'a gönder
    response = model.generate_content([
        {"mime_type": image.content_type, "data": image_bytes},
        PROMPT
    ])

    raw = response.text.strip()

    # Markdown kod bloğu varsa temizle
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    import json
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"AI yanıtı ayrıştırılamadı: {e}")

    return PhotoAnalysisResult(
        riskAreas=parsed.get("riskAreas", []),
        safeSpots=parsed.get("safeSpots", []),
        suggestions=parsed.get("suggestions", [])
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=9005, reload=True)
