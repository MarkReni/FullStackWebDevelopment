const Button = ({ countryName, value, handleClick }) => {
    return(
        <button onClick={() => handleClick(countryName)}>
            {value}
        </button>
    )
}

export default Button