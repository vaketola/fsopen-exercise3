const express = require('express')
const path = require('path')
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// get rid of the annoying favicon error
app.use(express.static(path.join(__dirname, 'public')))
// middleware for request time
app.use((request, response, next) => {
    request.requestTime = new Date()
    next()
})

// front page
app.get('/', (request, response) => {response.send('<h2>Phonebook<h2>')})
// info page
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${request.requestTime}</p>`)
})

// get all
app.get('/api/persons', (request, response) => {response.json(persons)})
// get one
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// delete one
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
