import { useState } from 'react'


const Header = ({text}) => <h1>{text}</h1>

const Button = ({name, handleClick}) => <button onClick={handleClick}>{name}</button>

const StaticLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = (prop) => {
  const good = prop.stats[0]
  const neutral = prop.stats[1]
  const bad = prop.stats[2]
  const totalCount = good + neutral + bad

  if(totalCount !== 0) {
    return(
      <table>
        <tbody>
          <StaticLine text="good" value={good}></StaticLine>
          <StaticLine text="neutral" value={neutral}></StaticLine>
          <StaticLine text="bad" value={bad}></StaticLine>
          <StaticLine text="all" value={totalCount}></StaticLine>
          <StaticLine text="average" value={((good + bad * -1)/totalCount).toFixed(1)}></StaticLine>
          <StaticLine text="positive"value={`${(good/totalCount * 100).toFixed(1)} %`}></StaticLine>
        </tbody>
      </table>
    )
  } else return <div>No feedback given</div>
  
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="Give Feedback"></Header>
      <Button name="good" handleClick={() => setGood(good + 1)}></Button>
      <Button name="neutral" handleClick={() => setNeutral(neutral + 1)}></Button>
      <Button name="bad" handleClick={() => setBad(bad + 1)}></Button>
      <Header text="Statistics"></Header>
      <Statistics stats={[good, neutral, bad]}></Statistics>
    </div>
  )
}

export default App