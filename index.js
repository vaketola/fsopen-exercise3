const express = require('express')
const path = require('path')
const app = express()

let notes = [
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

app.use((request, response, next) => {
    request.requestTime = new Date()
    next()
})

app.get('/', (request, response) => {
    response.send('<h2>Phonebook<h2>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${notes.length} people</p><p>${request.requestTime}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
