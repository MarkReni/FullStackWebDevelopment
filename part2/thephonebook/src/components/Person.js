const Person = ({ person, deleteDetails }) => { 
    return(
      <div> 
        {person.name} {person.number} {" "}
        <button onClick={deleteDetails}>delete</button>
      </div>
    )
}

export default Person