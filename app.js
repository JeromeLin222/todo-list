const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()
const db = require('./models')
const Todo = db.Todo

const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
    secret: 'ThisIsSecret',
    resave: false,
    saveUninitialized: false
}))

app.use(flash())

app.get('/', (req, res) => {
    res.redirect('/todos')
})

app.get('/todos', (req, res) => {
    try {
        return Todo.findAll({
            attributes: ['id', 'name', 'isComplete'],
            raw: true
        })
            .then((todos) => res.render('todos', { todos, message: req.flash('success') }))
            .catch((err) => {
                console.error(err)
                req.flash('error', '資了取得失敗')
            })
    } catch (err) {
        console.log(err)
        req.flash('error', 'Server Error')
        return res.redirect('back')
    }
})

app.get('/todos/new', (req, res) => {
    try {
        return res.render('new', { error: req.flash('error') })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Server Error')
        return res.redirect('back')
    }
})

app.post('/todos', (req, res) => {
    const name = req.body.name
    try {
        return Todo.create({ name })
            .then(() => {
                req.flash('success', '新增成功')
                return res.redirect('/todos')
            })
            .catch((err) => {
                console.log(err)
                req.flash('error', '新增失敗')
                return res.redirect('back')
            })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Server error')
        return res.redirect('back')
    }

})

app.get('/todos/:id', (req, res) => {
    const id = req.params.id
    try {
        return Todo.findByPk(id, {
            attributes: ['id', 'name', 'isComplete'],
            raw: true
        })
            .then((todo) => res.render('todo', { todo, message: req.flash('success') }))
            .catch((err) => {
                req.flash('error', '找不到資料')
                console.log(err)
            })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Server error')
        return res.redirect('back')
    }
})


app.get('/todos/:id/edit', (req, res) => {
    try {
        const id = req.params.id
        return Todo.findByPk(id, {
            attributes: ['id', 'name', 'isComplete'],
            raw: true
        })
            .then((todo) => res.render('edit', { todo, error: req.flash('error') }))
    } catch (err) {
        console.error(err)
        req.flash('error', 'Server error')
        return res.redirect('back')
    }

})

app.put('/todos/:id', (req, res) => {
    try {
        const { name, isComplete } = req.body
        const id = req.params.id
        return Todo.update(
            { name: name, isComplete: isComplete === 'completed' },
            { where: { id: id } }
        )
            .then(() => {
                req.flash('success', '更新成功')
                return res.redirect(`/todos/${id}`)
            })
            .catch((err) => {
                console.error(err)
                req.flash('error', '更新失敗')
                return res.redirect('back')
            }) 
    } catch (err) {
        console.error(err)
        req.flash('error', 'Server error')
        res.redirect('back')
    } 

    

})

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id
    return Todo.destroy({
        where: {
            id: id
        }
    })
        .then(() => {
            req.flash('success', '刪除成功')
            return res.redirect('/todos')
        })
})



app.listen(port, () => {
    console.log(`express server is running on http://localhost:${port}`)
})