import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setResources(response.data)
      })
      .catch(error => {
        console.log(error.message)
      })
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps
    
  const create = (resource) => {
    axios
      .post(baseUrl, resource)
      .then(response => {
        setResources([ ...resources, response.data ])
      })
      .catch(error => {
        console.log(error.message)
      })
  }
  
  const service = {
    create
  }
  
  return [
    resources, service
  ]
}