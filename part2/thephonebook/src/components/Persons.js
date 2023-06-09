import Person from './Person'

const Persons = ({ persons, deleteDetails }) => {
    return(
      persons.map(person =>
        <Person key={person.id} person={person} deleteDetails={() => deleteDetails(person.id)} />
      )
    )
}

export default Persons