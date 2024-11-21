const { log } = require('console')
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

const randomId = (max) => {
    return Math.floor(Math.random()*max)
}

// get rid of the annoying favicon error
app.use(express.static(path.join(__dirname, 'public')))
// middleware for request time
app.use((request, response, next) => {
    request.requestTime = new Date()
    next()
})
// middleware for parsing JSON requests
app.use(express.json())

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

// add entry
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body) {
        return response.status(400).json({error: 'invalid request content'})
    }
    if (!body.name) {
        return response.status(400).json({error: 'content must contain a name'})
    }
    if (!body.number) {
        return response.status(400).json({error: 'content must contain a number'})
    }
    if (persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const person = {
        name:   body.name,
        number: body.number,
        id:     String(randomId(persons.length * 10000)) // I hate this
    }
    // console.log(person)

    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
