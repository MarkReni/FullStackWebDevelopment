import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Testing <Blog />', () => {
  let renderedBlog
  const increaseLikes = jest.fn()

  const blog = {
    title: 'Superman',
    author: 'Jerry Siegel',
    url: 'www.superman.com',
    likes: 50,
    user: {
      username: 'Superuser'
    },
    id: '23534616'
  }

  const user = {
    username: 'Superuser'
  }

  beforeEach(() => {
    renderedBlog = render(<Blog blog={blog} user={user} increaseLikes={increaseLikes} />)
  })

  test('renders the blog\'s title and author, but does not render its URL or number of likes', () => {
    const shownDiv = renderedBlog.container.querySelector('.togglableBlogContentShown')
    const notShownDiv = renderedBlog.container.querySelector('.togglableBlogContentNotShown')

    screen.debug(notShownDiv)

    expect(shownDiv).toHaveTextContent('Superman')  // shownDiv has title included
    expect(shownDiv).toHaveTextContent('Jerry Siegel')  // shownDiv has author included
    expect(shownDiv).not.toHaveTextContent('www.superman.com')  // shownDiv does not have URL included
    expect(shownDiv).not.toHaveTextContent(50)  // shownDiv does not have likes included
    expect(shownDiv).not.toHaveStyle('display: none')  // shownDiv is visible
    expect(notShownDiv).toHaveStyle('display: none')  // notShownDiv is not visible; url and likes are not shown when style {display: 'none'}
  })

  test('blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('view')
    const notShownDiv = renderedBlog.container.querySelector('.togglableBlogContentNotShown')

    await user.click(button)

    expect(button).toBeDefined()
    expect(notShownDiv).toHaveTextContent('www.superman.com')  // notShownDiv has URL included
    expect(notShownDiv).toHaveTextContent(50)  // notShownDiv has likes included
    expect(notShownDiv).not.toHaveStyle('display: none')  // notShownDiv is visible
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('like')

    await user.click(button)
    await user.click(button)

    expect(button).toBeDefined()
    expect(increaseLikes.mock.calls).toHaveLength(2)
  })
})
