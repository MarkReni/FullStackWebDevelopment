import { useState } from 'react'


const Button = ({text, handleClick}) => <button onClick={handleClick}>{text}</button>

const Header = ({text}) => <h2>{text}</h2>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const anecdoteSize = anecdotes.length
  const pointsArray = Array(anecdoteSize).fill(0)

  const [selected, setSelected] = useState(0)
  const [points, setVote] = useState(pointsArray)

  const randomNum = () => {
    const randomNum = Math.floor(Math.random() * anecdoteSize)
    setSelected(randomNum)
  }

  const placeVote = () => {
    const copy = [...points]
    copy[selected] += 1
    setVote(copy)
  }

  const mostVotes = () => points.indexOf(Math.max(...points))
    
  return (
    <div>
      <Header text="Anecdote of the day"></Header>
      {anecdotes[selected]}
      <br/>
      has {points[selected]} votes
      <div>
        <Button handleClick={placeVote} text="vote"></Button>
        <Button handleClick={randomNum} text="next anecdote"></Button>
      </div>
      <Header text="Anecdote with most votes"></Header>
      {anecdotes[mostVotes()]}
      <br/>
      has {points[mostVotes()]} votes
    </div>
  )
}

export default App
