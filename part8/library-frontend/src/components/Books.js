import { useEffect, useState } from 'react'

const Books = (props) => {
  const [filteredBooks, setFilteredBooks] = useState(() => props.books)

  const books = props.books

  useEffect(() => {
    setFilteredBooks(books)
  }, [books])

  if (!props.show) {
    return null
  }

  const genres = [ ...new Set(books.map(book => book.genres).flat(Infinity)) ]
  
  const filter = (genre) => {
    setFilteredBooks(books.filter((b) => b.genres.includes(genre)))
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => filter(g)}>{g}</button>
        ))}
        <button onClick={() => setFilteredBooks(books)}>{"all genres"}</button>
      </div>
    </div>
  )
}

export default Books
