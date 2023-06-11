const Country = ({ countryData }) => {
    return(
        <div>
            <h2>{countryData.name}</h2>
            <div/>
            <div>capital {countryData.capital}</div>
            <div>area {countryData.area}</div>
            <h4>languages:</h4>
            <ul>
                {Object.values(countryData.languages).map((language, index) => {
                    return <li key={index}>{language}</li>
                })}
            </ul>
            <img src={countryData.flag} alt="Country flag"/>
        </div>
    )
}

export default Country