import { useState, useEffect } from "react";

// ============================================================
// REFACTORED VERSION OF Weather.jsx
// 
// WHAT CHANGED AND WHY (read this top to bottom):
//
// 1. Removed "React" from the import. 
//    Since React 17+, you don't need to import React itself 
//    just to write JSX. You also imported "use" which doesn't 
//    exist — removed that too.
//
// 2. Renamed "Loader" to "loading". 
//    Convention: state variables should be camelCase starting 
//    with a lowercase letter. Capital letters are reserved for 
//    Components. If another dev reads "Loader", they'll think 
//    it's a component, not a boolean.
//
// 3. Used async/await instead of .then() chains.
//    Both work. But async/await reads top-to-bottom like 
//    normal code. .then() chains get messy fast. Learn both, 
//    but prefer async/await in real codebases.
//
// 4. Used a "finally" block for the loader.
//    Your original code had setLoader(false) in TWO places 
//    (success AND error). "finally" runs no matter what, so 
//    you only write it once. Less duplication = fewer bugs.
//
// 5. Clear old error and old data before each new fetch.
//    Your original code had a subtle bug: if you search 
//    "London" successfully, then search "asdfghjkl" (invalid), 
//    the error message appears BUT London's weather data is 
//    still showing underneath it. We fix that by resetting 
//    both states before fetching.
//
// 6. Used the API response data to display city name.
//    Your original used {city} in the results display. 
//    Problem: if the user types "london" (lowercase), 
//    it shows "City is london". The API returns "London" 
//    (proper capitalized). Use the API data — it's more 
//    accurate.
//
// 7. API key moved to a constant outside the component.
//    It never changes, so it doesn't need to be recreated 
//    every single render. In a real app, this would be in 
//    an environment variable (.env file), NEVER hardcoded.
//    For learning purposes, this is fine.
// ============================================================

const API_KEY = "5255196ce6bae852aba645a08447234d";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

function WeatherRefactored() {
  // --- STATE ---
  // Each piece of state has ONE job. This is clean.
  const [city, setCity] = useState("");               // what the user is currently typing
  const [submittedCity, setSubmittedCity] = useState(""); // triggers the fetch via useEffect
  const [weatherData, setWeatherData] = useState(null);  // API response data
  const [loading, setLoading] = useState(false);         // is the API call in progress?
  const [error, setError] = useState("");                // error message to display

  // --- THE FETCH LOGIC (useEffect) ---
  // This runs every time submittedCity changes.
  // We use async/await here. It does the exact same thing 
  // as .then() chains, but reads like plain English.
  useEffect(() => {
    // Guard clause: don't fetch if nothing was submitted
    if (submittedCity === "") return;

    // We define an async function inside useEffect because
    // useEffect itself cannot be async (React rule).
    const fetchWeather = async () => {
      // Reset everything before a new search
      setLoading(true);
      setError("");
      setWeatherData(null);

      try {
        // "await" pauses here until the fetch completes.
        // No .then() needed.
        const response = await fetch(
          `${BASE_URL}?q=${submittedCity}&appid=${API_KEY}&units=metric`
        );

        // If the API returns an error status (404, 500, etc.)
        if (!response.ok) {
          throw new Error("City not found. Check your spelling.");
        }

        // "await" again — pauses until JSON parsing is done
        const data = await response.json();
        setWeatherData(data);

      } catch (err) {
        // If ANYTHING above fails, we land here
        setError(err.message);

      } finally {
        // This runs no matter what — success or failure.
        // One line instead of two. Clean.
        setLoading(false);
      }
    };

    // Call the function we just defined
    fetchWeather();

  }, [submittedCity]);

  // --- EVENT HANDLER ---
  // Arrow function is fine here too. Both styles work.
  // This is the "trigger" that makes useEffect run.
  const handleGetWeather = () => {
    // Trim removes accidental spaces. Try typing "  London  " 
    // in your current version — it breaks. This fixes that.
    const trimmedCity = city.trim();

    // Don't submit if the input is empty or just spaces
    if (trimmedCity === "") return;

    setSubmittedCity(trimmedCity);
  };

  // --- THE JSX ---
  return (
    <div className="main-weather">
      <h2>Weather Forecast</h2>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleGetWeather}>Get Weather</button>
      </div>

      <div className="display-box">
        {/* 
          Notice the order: Loading → Error → Data
          Only ONE of these should show at a time.
          
          Your original code could show loading AND old data 
          simultaneously. This version prevents that because 
          we reset weatherData to null before each fetch.
        */}

        {loading && <p>Loading...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {weatherData && weatherData.main && (
          <div className="weather-displayed">
            {/* 
              weatherData.name comes from the API itself.
              It returns the proper city name: "London", not "london"
            */}
            <h2>{weatherData.name}</h2>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Weather: {weatherData.weather[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherRefactored;
