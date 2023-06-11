import { useState, useEffect } from 'react'
import countryService from './services/countryServices'
import Country from './components/Country'
import Button from './components/Button'
import Weather from './components/Weather'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [weatherData, setWeather] = useState(null)

  useEffect(() => {
    // skip if value is not defined
    if(value !== '') {
      countryService.getCountries()
        .then(response => {
          const data = response
          console.log(value)
          const organizedData = data.map((country, index) => ({
            key: index, 
            name: country.name.common, 
            capital: country.capital, 
            area: country.area, 
            languages: country.languages, 
            flag: country.flags.png
          }))

          const filteredCountries = organizedData.filter(country => 
            country.name.toLowerCase().includes(value.toLowerCase()))
          setCountries(filteredCountries)
          
          // don't communicate with the server in case weather data is not needed
          if(filteredCountries.length === 1) {
            countryService.getCity(filteredCountries[0].capital).then(response => {  // not the optimal solution, ok for this exercise
              setWeather(response)
            }).catch(error => {
              console.log("No weather data found")
              setWeather(null)
            })
          }
        })
    }
  }, [value])
  
  const manageText = () => {
    const countryAmount = countries.length
    if(countryAmount > 10) return ['Too many matches, specify another filter']
    else if(countryAmount === 1) {
      return (countries.map(country =>
        <div key={country.key}>
          <Country countryData={country} />
          <Weather capital={country.capital} weatherData={weatherData} />
        </div>
      ))
    } else {
      return (
        countries.map(country => {
          return(
            <div key={country.key}>
              {country.name}<Button countryName={country.name} value='show' handleClick={handleClick} />
            </div>
          ) 
        })
      )
    }
  }
  
  const handleChange = (event) => setValue(event.target.value)
  
  const handleClick = (value) => setValue(value)

  return (
    <div>
      <form>
        find countries<input value={value} onChange={handleChange} onFocus={() => setValue('')}/>
      </form>
      {manageText().map(text => text)}
    </div>
  )
}

export default App
