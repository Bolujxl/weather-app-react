import { useState, useEffect} from "react";
import './index.css'

function Weather() {
    const [city, setCity] = useState("")
    const [submittedCity, setSubmittedCity] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [weatherData, setWeatherData] = useState(null);
    const apiKey = "5255196ce6bae852aba645a08447234d"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${submittedCity}&appid=${apiKey}&units=metric`


    // this could be written better but i am trying to make sure i involve useEffect
    useEffect(() => {
        if (submittedCity !== "") {
            setIsLoading(true)
            setError("");
            setWeatherData(null);

            fetch(url).then((response) => {
                if (!response.ok){
                    throw new Error("Error fetching data or City not found")
                }
                return response.json()
            })
            .then((data) => {setWeatherData(data); setIsLoading(false)})
            .catch((errer) => {
                setError(errer.message);
                setIsLoading(false)
            })
        }
        
    }, [submittedCity])

    const handleGetWeather = (e) => {
        e.preventDefault()
        const formatCity = city.trim();
        if (formatCity === "") return;
        setSubmittedCity(formatCity)
    }


    return (
        <div className="main-weather">
           <h2> Weather display by Cities</h2>

           <form className="input-box">
            <input type="text" placeholder="Enter your city" value={city} onChange={(e) => setCity(e.target.value)}/>
            <button onClick={handleGetWeather}>Get Weather</button>
           </form>

           <div className="display-box">
            {isLoading && (
              <p className="loadingTag">
                <span className="material-symbols-rounded spin">progress_activity</span>
                Loading weather data...
              </p>
            )}

            {error && (
              <p className="errorTag">
                <span className="material-symbols-rounded">report</span>
                {error}
              </p>
            )}



            {weatherData && weatherData.main && (
                <div className="weather-displayed">

                    <div className="weather-hero">
                        <div className="hero-left">
                            <h2 className="city-name">{weatherData.name}</h2>
                            <p className="weather-description">{weatherData.weather[0].description}</p>
                            <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
                        </div>
                        <div className="hero-right">
                            <img 
                                className="weather-icon"
                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                                alt={weatherData.weather[0].description}
                            />
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-label"><span className="material-symbols-rounded stat-icon">thermostat</span> Feels Like</span>
                            <span className="stat-value">{Math.round(weatherData.main.feels_like)}°C</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label"><span className="material-symbols-rounded stat-icon">humidity_percentage</span> Humidity</span>
                            <span className="stat-value">{weatherData.main.humidity}%</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label"><span className="material-symbols-rounded stat-icon">air</span> Wind</span>
                            <span className="stat-value">{weatherData.wind.speed} m/s</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label"><span className="material-symbols-rounded stat-icon">speed</span> Pressure</span>
                            <span className="stat-value">{weatherData.main.pressure} hPa</span>
                        </div>
                    </div>

                </div>
            )}
           </div>

           
        </div>
    );
}

export default Weather;