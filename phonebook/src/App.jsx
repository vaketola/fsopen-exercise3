import personService from './services/persons'
import { useState, useEffect } from 'react'
import './styles.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Header = ({ text }) => {
  return <h2>{text}</h2>
}

const handleDelete = (person, persons, setPersons, setSuccessMessage, setErrorMessage) => {
  if (confirm(`Delete ${person.name}?`)) {
    personService.remove(person.id)
                 .then(response => {
                  const newPersons = persons.filter(p => p.id !== response.data.id)
                  setPersons(newPersons)
                  setSuccessMessage(`Removed ${person.name}`)
                  setTimeout(() => {setSuccessMessage(null)}, 3000)
                })
                .catch(error => {
                  setErrorMessage(`Information of ${person.name} has already been removed from server`)
                  setTimeout(() => {setErrorMessage(null)}, 3000)
                })
  }
}

// const updateNumber = (persons, oldPerson, newNumber) => {
//   const newPersons = persons.map(person => {
//     if (person.id === oldPerson.id) {
//       return { ...person, number:newNumber }
//     }
//     return person
//   })
//   return newPersons
// }

const NameEntry = ({ person, persons, filter, setPersons, setSuccessMessage, setErrorMessage }) => {
  if (person.name.toLowerCase().includes(filter.toLowerCase())) {
    return (
      <div>
        {person.name} {person.number} <button onClick={() => handleDelete(person, persons, setPersons, setSuccessMessage, setErrorMessage)}>delete</button>
      </div>
    ) 
  }
}

const Persons = ({ persons, newFilter, setPersons, setSuccessMessage, setErrorMessage }) => {
  return (
    persons.map(person => <NameEntry key={person.id} 
                                     person={person} 
                                     persons={persons}
                                     filter={newFilter}
                                     setPersons={setPersons}
                                     setSuccessMessage={setSuccessMessage}
                                     setErrorMessage={setErrorMessage}/>)
  )
}

const FormField = ({ text, value, handler }) => {
  return <div>{text} <input value={value} onChange={handler}/></div>
}

const App = () => {
  const [persons,   setPersons]   = useState([]) 
  const [newFilter, setNewFilter] = useState('')
  const [newName,   setNewName]   = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage,   setErrorMessage]   = useState(null)

  useEffect(() => {
    personService.getAll()
                 .then(response => {setPersons(response.data)})
  }, [])  

  const addName = (event) => {
    event.preventDefault()
    const match = persons.find(person => person.name === newName)
    if (match) {
      setNewName('')
      setNewNumber('')
      setErrorMessage(`${newName} is already added to the phonebook`)
      setTimeout(() => {setErrorMessage(null)}, 3000)
      // if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      //   const newPerson = {name:newName, number:newNumber}
      //   personService.update(match.id, newPerson)
      //                .then(() => {
      //                 setPersons(updateNumber(persons, match, newNumber))
      //                 setNewName('')
      //                 setNewNumber('')

      //                 setSuccessMessage(`Updated ${newName}`)
      //                 setTimeout(() => {setSuccessMessage(null)}, 3000)
      //                })
      // }
    } else {
      const newPerson = {name:newName, number:newNumber}
      personService.create(newPerson)
                   .then(response => {
                    setPersons(persons.concat(response.data))
                    setNewName('')
                    setNewNumber('')

                    setSuccessMessage(`Added ${newName}`)
                    setTimeout(() => {setSuccessMessage(null)}, 3000)
                   })
    }
  }

  const handleNewFilter = (event) => {setNewFilter(event.target.value)}
  const handleNewName   = (event) => {setNewName(event.target.value)}
  const handleNewNumber = (event) => {setNewNumber(event.target.value)}

  return (
    <div>
      <Header text='Phonebook' />
      <Notification      message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <FormField text='filter shown with' value={newFilter} handler={handleNewFilter}/>
      <Header text='add a new' />
      <form onSubmit={addName}>
        <FormField text='name:'   value={newName}   handler={handleNewName}/>
        <FormField text='number:' value={newNumber} handler={handleNewNumber}/>
        <button type='submit'>add</button>
      </form>
      <Header text='Numbers' />
      <Persons persons={persons} newFilter={newFilter} setPersons={setPersons} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}/>
    </div>
  )
}


export default App
