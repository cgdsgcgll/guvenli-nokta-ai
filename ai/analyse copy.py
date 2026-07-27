import os
from rich import print as rprint
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent

class RiskAnalysis(BaseModel):
    score: int = Field(description="Deprem güvenlik skoru (0-100)")
    riskAreas: List[str] = Field(description="Riskli alanların listesi")
    safeSpots: List[str] = Field(description="Güvenli noktaların listesi")
    missingPreparations: List[str] = Field(description="Eksik hazırlıkların listesi")

def run_risk_agent(form_data: Dict[str, bool]) -> Dict[str, Any]:
    base_score = 100
    if form_data.get("has_large_cupboard", False): base_score -= 15
    if form_data.get("near_window_seating", False): base_score -= 10
    if form_data.get("obstacle_near_exit", False): base_score -= 20
    if not form_data.get("has_earthquake_bag", False): base_score -= 20
    if form_data.get("has_vulnerable_individuals", False): base_score -= 10
    base_score = max(0, base_score)

    raw_content = f"""
    - Sabitlenmemiş büyük dolap var mı?: {"Evet" if form_data.get("has_large_cupboard") else "Hayır"}
    - Cam kenarında oturma alanı var mı?: {"Evet" if form_data.get("near_window_seating") else "Hayır"}
    - Çıkış kapısına yakın engel var mı?: {"Evet" if form_data.get("obstacle_near_exit") else "Hayır"}
    - Deprem çantası var mı?: {"Evet" if form_data.get("has_earthquake_bag") else "Hayır"}
    - Çocuk/yaşlı/evcil hayvan var mı?: {"Evet" if form_data.get("has_vulnerable_individuals") else "Hayır"}
    - Kural tabanlı hesaplanan baz puan: {base_score}
    """

    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
    agent = create_agent(
        model=model,
        system_prompt=f"Sen kullanıcının ev bilgilerine göre deprem risk analizi yapan bir danışmansın. Çıktındaki 'score' değerini kesinlikle sana verilen baz puana eşitlemelisin. Bilgiler: {raw_content}",
        response_format=RiskAnalysis
    )

    response = agent.invoke({
        "messages": [("user", "Yukarıdaki bilgilere göre riskli alanları, güvenli noktaları ve eksiklikleri listele.")]
        })
    return response["structured_response"].model_dump()


# =====================================================================
# GERÇEK ZAMANLI TEST ALANI (Lokalde denemek istersen burayı kullanabilirsin)
# =====================================================================
if __name__ == "__main__":
    # os.environ["GOOGLE_API_KEY"] = "BURAYA_TEST_ICIN_YAZABILIRSIN"
    if "GOOGLE_API_KEY" not in os.environ:
        raise ValueError("Lütfen sistemde 'GOOGLE_API_KEY' ortam değişkenini tanımlayın.")

    mock_form_data = {
            "has_large_cupboard": True,
            "near_window_seating": True,
            "obstacle_near_exit": False,
            "has_earthquake_bag": True,
            "has_vulnerable_individuals": False
        }
    try:
        sonuc = run_risk_agent(mock_form_data)
        rprint(sonuc)
    except Exception as e:
        print(f"Hata: {e}")