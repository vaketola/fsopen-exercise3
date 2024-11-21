const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
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

app.use(express.static(path.join(__dirname, 'public')))

app.use((request, response, next) => {
    request.requestTime = new Date()
    next()
})

app.use(express.json())

morgan.token('body', (request, response) => {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// This is equivalent to 'tiny' + body (from the docs)

app.use(cors({origin: 'http://localhost:5173'}))


app.get('/', (request, response) => {response.send('<h2>Phonebook<h2>')})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${request.requestTime}</p>`)
})

app.get('/api/persons', (request, response) => {response.json(persons)})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

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
