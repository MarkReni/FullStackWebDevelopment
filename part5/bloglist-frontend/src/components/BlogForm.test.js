import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('Testing <BlogForm />', () => {
  const createBlog = jest.fn()
  let renderedBlogForm

  beforeEach(() => {
    renderedBlogForm = render(<BlogForm createBlog={createBlog} />)
  })

  test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const button = renderedBlogForm.getByText('create')
    const inputTitle = screen.getByPlaceholderText('writeTitle')
    const inputAuthor = screen.getByPlaceholderText('writeAuthor')
    const inputUrl = screen.getByPlaceholderText('writeUrl')

    await user.type(inputTitle, 'Badman')
    await user.type(inputAuthor, 'Bob Kane')
    await user.type(inputUrl, 'www.badman.com')
    await user.click(button)

    expect(button).toBeDefined()
    expect(inputTitle).toBeDefined()
    expect(inputAuthor).toBeDefined()
    expect(inputUrl).toBeDefined()
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Badman')
    expect(createBlog.mock.calls[0][0].author).toBe('Bob Kane')
    expect(createBlog.mock.calls[0][0].url).toBe('www.badman.com')
  })
})