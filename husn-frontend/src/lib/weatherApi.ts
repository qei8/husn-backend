const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getCurrentWeather(lat: number, lon: number) {
  if (!WEATHER_API_KEY) {
    return {
      weather: [{ description: 'API key missing' }],
      main: { temp: '--', humidity: '--' },
      wind: { speed: '--' },
      isFallback: true,
    };
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch weather');
  }

  return res.json();
}
