import httpx
import os

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("WEATHER_API_KEY")
        self.base_url = "http://api.openweathermap.org/data/2.5/weather"

    async def get_weather(self, city: str = "Aden"):
        """
        Fetch real-time weather. Tries to detect city by IP if not provided.
        """
        # Try to detect city by IP if it's the default
        if city == "Aden":
            try:
                async with httpx.AsyncClient() as client:
                    ip_res = await client.get("http://ip-api.com/json/", timeout=5)
                    if ip_res.status_code == 200:
                        city = ip_res.json().get("city", "Aden")
            except:
                pass

        if not self.api_key or "your_openweather" in self.api_key:
            # Mock data for preview if API key is not set
            return {
                "temp": 24.5,
                "condition": "Sunny",
                "city": city,
                "is_mock": True
            }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.base_url,
                    params={
                        "q": city,
                        "appid": self.api_key,
                        "units": "metric"
                    }
                )
                data = response.json()
                return {
                    "temp": data["main"]["temp"],
                    "condition": data["weather"][0]["main"],
                    "city": data["name"],
                    "is_mock": False
                }
        except Exception as e:
            print(f"Error fetching weather: {e}")
            return {"temp": 20, "condition": "Clear", "city": city, "is_mock": True}

weather_service = WeatherService()
