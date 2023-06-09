const Filter = ({ handleFilterChange, newFilter }) => {
    return(
      <div>
        filter shown with
        <input 
          value={newFilter}
          onChange={handleFilterChange}
        />
      </div>
    )
}

export default Filter