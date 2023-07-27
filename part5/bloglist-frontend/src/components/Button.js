const Button = ({ text, handleClick, color }) => {
  const buttonStyle = {
    'backgroundColor': `${color}`,
    'borderRadius':'5px'
  }

  return (
    <button type="submit" onClick={handleClick} style={buttonStyle}> {text} </button>
  )}

export default Button