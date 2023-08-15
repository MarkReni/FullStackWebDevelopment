describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Superuser',
      username: 'root',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('login form is shown', function() {
    cy.contains('log in to application')
    cy.get('input').should('have.length', 2)
    cy.get('button').contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Superuser logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.errorMessage')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')  // notification is red
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'border-radius', '5px')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('input[placeholder="writeTitle"]').type('Superman')
      cy.get('input[placeholder="writeAuthor"]').type('Jerry Siegel')
      cy.get('input[placeholder="writeUrl"]').type('www.superman.com')
      cy.get('#create-button').click()

      cy.get('.message')
        .should('contain', 'A new blog Superman by Jerry Siegel added')
      cy.contains('Superman Jerry Siegel')
    })

    describe('When a blog is already created', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Badman', author: 'Bob Kane', url: 'www.badman.com' })
      })

      it('Users can like a blog', function() {
        cy.contains('view').click()
        cy.contains('like').as('likeButton')

        cy.get('@likeButton').click()
        cy.contains(1)
        cy.get('@likeButton').click()
        cy.contains(2)
      })

      it('User who created a blog can delete it', function() {
        cy.contains('Badman Bob Kane')

        cy.contains('view').click()
        cy.contains('remove').click()

        cy.should('not.contain', 'Badman Bob Kane')
      })

      it('Only the creator can see the delete button of a blog', function() {
        const user = {
          name: 'Supermark',
          username: 'mark',
          password: 'salainen'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

        // creator user sees the 'remove' button
        cy.contains('view').click()
        cy.contains('remove')

        // switched user does not see the 'remove' button
        cy.contains('logout').click()
        cy.get('#username').type('mark')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()

        cy.contains('view').click()
        cy.should('not.contain', 'remove')
      })

      it('The blogs are ordered according to likes (most likes first)', function() {
        // blog 1
        cy.contains('Badman').find('button').click()
        cy.contains('badman.com').parent().contains('like').as('likeButton-1')
        cy.get('@likeButton-1').click()
        cy.wait(500)
        cy.get('@likeButton-1').click()
        cy.wait(500)
        // blog 2
        cy.contains('create new blog').click()
        cy.get('input[placeholder="writeTitle"]').type('Superman')
        cy.get('input[placeholder="writeAuthor"]').type('Jerry Siegel')
        cy.get('input[placeholder="writeUrl"]').type('www.superman.com')
        cy.get('#create-button').click()
        cy.contains('Superman').find('button').click()
        cy.contains('superman.com').parent().contains('like').as('likeButton-2')
        cy.get('@likeButton-2').click()
        cy.wait(500)
        cy.get('@likeButton-2').click()
        cy.wait(500)
        cy.get('@likeButton-2').click()
        cy.wait(500)
        cy.get('@likeButton-2').click()
        cy.wait(500)
        // blog 3
        cy.contains('create new blog').click()
        cy.get('input[placeholder="writeTitle"]').type('Antman')
        cy.get('input[placeholder="writeAuthor"]').type('Stan Lee')
        cy.get('input[placeholder="writeUrl"]').type('www.antman.com')
        cy.get('#create-button').click()
        cy.contains('Antman').find('button').click()
        cy.contains('antman.com').parent().contains('like').as('likeButton-3')
        cy.get('@likeButton-3').click()
        cy.wait(500)
        cy.get('@likeButton-3').click()
        cy.wait(500)
        cy.get('@likeButton-3').click()
        cy.wait(500)

        // tests
        cy.get('.blog').eq(0).should('contain', 'Superman')
        cy.get('.blog').eq(1).should('contain', 'Antman')
        cy.get('.blog').eq(2).should('contain', 'Badman')
      })
    })
  })
})