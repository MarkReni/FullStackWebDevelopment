import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const api_key = process.env.REACT_APP_API_KEY
const weatherUrl = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`

const getCountries = () => {
    const request = axios.get(`${baseUrl}`)
    return request.then(response => response.data)
}

const getCity = (city) => {
    const request = axios.get(weatherUrl(city))
    return request.then(response => response.data)
}

const countryServices = { getCountries, getCity }

export default countryServices