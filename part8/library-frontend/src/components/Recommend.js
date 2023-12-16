const Recommend = (props) => {
if (!props.show) {
    return null
  }

  const books = props.books
  const recommendations = books.filter((b) => b.genres.includes(props.favorite.favoriteGenre))

  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre <b>{props.favorite.favoriteGenre}</b></div>
      <br/>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendations.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend