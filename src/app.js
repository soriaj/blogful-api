require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
// const ArticlesService = require('./articles-service')
const articlesRouter = require('./articles/articles-router')
const usersRouter = require('./users/users-router')
const commentsRouter = require('./comments/comments-router')
const setTZ = require('set-tz')
setTZ('UTC')

const app = express()
const jsonParser = express.json()

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/articles', articlesRouter)
app.use('/api/users', usersRouter)
app.use('/api/comments', commentsRouter)
// app.get('/articles', (req, res, next) => {
//    const knexInstance = req.app.get('db')
//    ArticlesService.getAllArticles(knexInstance)
//       .then(articles => {
//          res.json(articles)
//       })
//       .catch(next)
// })

// app.post('/articles', jsonParser, (req, res, next) => {
//    const { title, content, style } = req.body
//    const knexInstance = req.app.get('db')
//    const newArticle = { title, content, style }
//    ArticlesService.insertArticle(knexInstance, newArticle)
//       .then(article => {
//          res.status(201).location(`/articles/${article.id}`).json(article)
//       })
//       .catch(next)
// })

// app.get('/articles/:article_id', (req, res, next) => {
//    const knexInstance = req.app.get('db')
//    ArticlesService.getById(knexInstance, req.params.article_id)
//       .then(article => {
//          if(!article){
//             return res.status(404).json({ error: { message: `Article doesn't exist` }})
//          }
//          res.json(article)
//       })
//       .catch(next)
// })

app.get('/', (req, res) => {
   res.send('Hello, World!')
})

app.get('/xss', (req, res) => {
   res.cookie('secretToken', '1234567890');
   res.sendFile(__dirname + '/xss-example.html')
})

app.use(function errorHandler(error, req, res, next) {
   let response
   if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
   } else {
      console.error(error)
      response = { message: error.message, error }
   }
   res.status(500).json(response)
})

module.exports = app