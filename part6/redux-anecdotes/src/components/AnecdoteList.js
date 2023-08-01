import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { createNotification, deleteNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return (
      anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    )})

  return (
    <div>
      {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(vote(anecdote.id))
            dispatch(createNotification({
              notification: `you voted '${anecdote.content}'`,
              visible: true
            }))
            setTimeout(() => {
              dispatch(deleteNotification({
                notification: '',
                visible: false
              }))
            }, 5000)
          }}
        />
      )}
    </div>
  )
}

export default AnecdoteList