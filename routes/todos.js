const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo


router.get('/', (req, res) => {
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

router.get('/new', (req, res) => {
    try {
        return res.render('new', { error: req.flash('error') })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Server Error')
        return res.redirect('back')
    }
})

router.post('/', (req, res) => {
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

router.get('/:id', (req, res) => {
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


router.get('/:id/edit', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
    try {
        const id = req.params.id
        return Todo.destroy({ where: {id} })
        .then(() => {
            req.flash('success', '刪除成功')
            return res.redirect('/todos')
        })
        .catch((error) => {
            console.error(error)
            req.flash('error', '刪除失敗')
            return res.redirect('back')
        })
    } catch (error) {
        console.error(error)
        req.flash('error', '刪除失敗')
        return res.redirect('back')
    }
})

module.exports = router