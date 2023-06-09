import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

let errorOn = false

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => setNewFilter(event.target.value.toLowerCase())
  
  const addDetails = (event) => {
    event.preventDefault()
    const objectName = {
      name: newName,
      number: newNumber
    }

    const personNames = persons.map(person => person.name)
    if(personNames.includes(newName)) {
      const answer = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if(answer) {
        const personToBeChanged = persons.find(person => person.name === newName)
        const personId = personToBeChanged.id
        const changedNumber = {...personToBeChanged, number: newNumber}
        personService
          .changeNumber(personId, changedNumber).then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personId ? person: returnedPerson))
            setMessage(`${newName}'s number was changed`)
          }).catch(error => {
            errorOn = true
            setMessage(`Information of ${newName} has already been removed from server`)
          })
        setTimeout(() => {
          setMessage(null)
        }, 2000)
        errorOn = false
      }
      setNewName('')
      setNewNumber('')
    } else {
      personService
      .createPerson(objectName)
      .then(response => {
        setPersons(persons.concat(response))
      })
      setMessage(`Added ${objectName.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 2000)
      setNewName('')
      setNewNumber('')
    }
  }

  const deleteDetails = id => {
    const personToDelete = persons.find(person => person.id === id)
    const answer = window.confirm(`Delete ${personToDelete.name}?`)
    if(answer) {
      personService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage(`Contact was deleted`)
        }).catch(
          error => {
            errorOn = true
            setMessage(`Contact has already been deleted`)
          })
      setTimeout(() => {
        setMessage(null)
      }, 2000)
      errorOn = false
    } 
  }

  const personsFiltered = persons.filter(person => person.name.toLowerCase().includes(newFilter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} errorOn={errorOn} />
      <Filter handleFilterChange={handleFilterChange} newFilter={newFilter} />
      <h3>Add a new</h3>
      <PersonForm addDetails={addDetails} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={personsFiltered} deleteDetails={deleteDetails}/>
    </div>
  )
}

export default App
