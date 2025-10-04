import { useState, useEffect } from "react";
import { UserData } from "@/types/user";

type Coords = { lat: number; lon: number } | null;

export function useWeatherLocation(userData: UserData | null, coords: Coords) {
  const [weather, setWeather] = useState<{ temp: number; icon: string } | null>(null);
  const [location, setLocation] = useState<string>(userData?.city || "Warszawa");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey) {
          setLoading(false);
          return;
        }
        let url = "";
        let data;
        // 1. Try postal code
        if (userData?.postalCode) {
          const country = userData.countryCode || "PL";
          const geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(
            userData.postalCode
          )},${country}&appid=${apiKey}`;
          console.log("[Weather] Trying postal code:", userData.postalCode, country, geoUrl);
          const geoRes = await fetch(geoUrl);
          const geoData = await geoRes.json();
          console.log("[Weather] Geocoding response:", geoData);
          if (geoData && geoData.lat && geoData.lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${geoData.lat}&lon=${geoData.lon}&units=metric&appid=${apiKey}`;
            console.log("[Weather] Fetching weather by postal code coordinates:", url);
            const res = await fetch(url);
            const weatherData = await res.json();
            console.log("[Weather] Weather response (postal code):", weatherData);
            if (weatherData && weatherData.main && weatherData.weather) {
              setWeather({
                temp: Math.round(weatherData.main.temp),
                icon: weatherData.weather[0].icon,
              });
              if (weatherData.name) {
                setLocation(weatherData.name);
                console.log("[Weather] Location set from weather API:", weatherData.name);
              }
              setLoading(false);
              return;
            }
          } else {
            console.warn("[Weather] Invalid postal code, falling back to city or geolocation.");
          }
        }
        // 2. Try city if no valid postal code
        if (userData?.city) {
          url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(userData.city)},PL&units=metric&appid=${apiKey}`;
          console.log("[Weather] Trying city:", userData.city, url);
          const res = await fetch(url);
          const cityData = await res.json();
          console.log("[Weather] Weather response (city):", cityData);
          if (cityData && cityData.main && cityData.weather && !(cityData.cod === "404" || cityData.cod === 404)) {
            setWeather({
              temp: Math.round(cityData.main.temp),
              icon: cityData.weather[0].icon,
            });
            if (cityData.name) {
              setLocation(cityData.name);
              console.log("[Weather] Location set from weather API:", cityData.name);
            }
            setLoading(false);
            return;
          } else {
            console.warn("[Weather] City not found, falling back to geolocation or Warszawa.");
          }
        }
        // 3. Fallback to geolocation or Warszawa
        if (coords) {
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`;
          console.log("[Weather] Fallback to geolocation:", coords, url);
          const res = await fetch(url);
          const geoLocData = await res.json();
          console.log("[Weather] Weather response (geolocation):", geoLocData);
          if (geoLocData && geoLocData.main && geoLocData.weather) {
            setWeather({
              temp: Math.round(geoLocData.main.temp),
              icon: geoLocData.weather[0].icon,
            });
            if (geoLocData.name) {
              setLocation(geoLocData.name);
              console.log("[Weather] Location set from weather API:", geoLocData.name);
            }
            setLoading(false);
            return;
          }
        }
        // 4. Fallback to Warszawa
        url = `https://api.openweathermap.org/data/2.5/weather?q=Warszawa,PL&units=metric&appid=${apiKey}`;
        console.log("[Weather] Fallback to Warszawa:", url);
        const res = await fetch(url);
        const warszawaData = await res.json();
        console.log("[Weather] Weather response (Warszawa):", warszawaData);
        if (warszawaData && warszawaData.main && warszawaData.weather) {
          setWeather({
            temp: Math.round(warszawaData.main.temp),
            icon: warszawaData.weather[0].icon,
          });
          if (warszawaData.name) {
            setLocation(warszawaData.name);
            console.log("[Weather] Location set from weather API:", warszawaData.name);
          }
        } else {
          setWeather(null);
        }
      } catch (err) {
        console.error("[Weather] Error fetching weather:", err);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // update every 10 min
    return () => clearInterval(interval);
  }, [userData?.postalCode, userData?.countryCode, userData?.city, coords]);

  return { weather, location, loading };
}
