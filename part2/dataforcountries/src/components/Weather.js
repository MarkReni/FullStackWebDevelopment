const Weather = ({ capital, weatherData }) => {
    if(weatherData) {
        return(
            <div>
                <h2>Weather in {capital}</h2>
                <div>temperature {weatherData.main.temp} Celcius</div>
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Weather icon"/>
                <div>wind {weatherData.wind.speed} m/s</div>
            </div>
        )
    }
}

export default Weather