const express = require('express')
const app = express()
const db = require('./models')
const Todo = db.Todo
const port = 3000

app.get('/', (req, res) => {
    res.send('Express server is running.')
})

app.get('/todos', (req, res) => {
    return Todo.findAll()
        .then((todos) => res.send({ todos }))
        .catch((err) => res.status(422).json(err))
})

app.get('/todos/new', (req, res) => {
    res.send('Create todo')
})

app.post('/todos', (req, res) => {
    res.send('add todos')
})

app.get('/todos/:id', (req, res) => {
    res.send(`get todo id: ${req.params.id}`)
})


app.get('/todos/:id/edit', (req, res) => {
    res.send(`edit todo id:${req.params.id}`)
})

app.put('/todos/:id', (req, res) => {
    res.send(`update todos id:${req.params.id}`)
})

app.delete('/todos/:id', (req, res) => {
    res.send(`delete todos id: ${req.params.id}`)
})



app.listen(port, () => {
    console.log(`express server is running on http://localhost:${port}`)
})