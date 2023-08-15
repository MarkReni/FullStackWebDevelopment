import { createContext, useReducer, useContext } from 'react'

const initialState = {
  user: null
}

const userReducer = (state, action) => {
  switch (action.type) {
  case 'SET':
    return { user: action.payload.user }
  default:
    return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, initialState)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserContent = () => {
  const setUserAndDispatch = useContext(UserContext)
  return setUserAndDispatch[0]
}

export const useUserDispatch = () => {
  const setUserAndDispatch = useContext(UserContext)
  return setUserAndDispatch[1]
}

export default UserContext