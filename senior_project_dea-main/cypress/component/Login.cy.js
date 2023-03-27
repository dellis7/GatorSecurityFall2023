import React from 'react'
import Login from '../../src/components/users/Login'

describe('<Login/> Page Component', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Login />)

  })

  it('Gives the correct response for invalid credentials', () => {
    cy.mount(<Login />)

  })
  
})