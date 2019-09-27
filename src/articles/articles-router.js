const path = require('path')
const express = require('express')
const xss = require('xss')
const ArticlesService = require('./articles-service')
// const ArticlesService = require('./articles-service')

const articlesRouter = express.Router()
const jsonParser = express.json()

const serializeArticle = article => ({
   id: article.id,
   style: article.style,
   title: xss(article.title),
   content: xss(article.content),
   date_published: article.date_published,
})

articlesRouter
   .route('/')
   .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      ArticlesService.getAllArticles(knexInstance)
         .then(articles => {
            res.json(articles.map(serializeArticle))
         })
         .catch(next)
   })
   .post(jsonParser, (req, res, next) => {
      const knexInstance = req.app.get('db')
      const { title, style, content } = req.body
      const newArticle = { title, style, content }

      for(const [key, value] of Object.entries(newArticle)){
         if(value == null){
            return res.status(400).json({
               error: { message: `Missing '${key}' in request body`}
            })
         }
      }

      ArticlesService.insertArticle(knexInstance, newArticle)
         .then(article => {
            res.status(201).location(path.posix.join(req.originalUrl,`/${article.id}`)).json(serializeArticle(article))
         })
         .catch(next)
   })
articlesRouter
   .route('/:article_id')
   .all((req, res, next) => {
      const { article_id }  = req.params
      const knexInstance = req.app.get('db')
      ArticlesService.getById(knexInstance, article_id)
         .then(article => {
            if(!article){
               return res.status(404).json({ error: { message: `Article doesn't exist` }})
            }
            res.article = article
            next()
         })
         .catch(next)
   })
   .get((req, res, next) => {
      res.json(serializeArticle(res.article))
   })
   // .get((req, res, next) => {
   //    const { article_id }  = req.params
   //    const knexInstance = req.app.get('db')
   //    ArticlesService.getById(knexInstance, article_id)
   //       .then(article => {
   //          if(!article){
   //             return res.status(404).json({ error: { message: `Article doesn't exist` }})
   //          }
   //          res.json({
   //             id: article.id,
   //             style: article.style,
   //             title: xss(article.title), // sanitize title
   //             content: xss(article.content), //sanitze content
   //             date_published: article.date_published,
   //          })
   //       })
   //       .catch(next)
   // })
   .delete((req, res, next) => {
      const knexInstance = req.app.get('db')
      const { article_id } = req.params
      ArticlesService.deleteArticle(knexInstance, article_id)
         .then(() => {
            res.status(204).end()
         })
         .catch(next)
   })
   .patch(jsonParser, (req, res, next) => {
      const { title, style, content } = req.body
      const articleToUpdate = { title, style, content }
      const knexInstance = req.app.get('db')
      const { article_id } = req.params
      
      // checking for truthy values
      const numberOfValues = Object.values(articleToUpdate).filter(Boolean).length
      if(numberOfValues === 0) {
         return res.status(400).json({ error: { message: `Request body must contain either 'title', 'style' or 'content'`} })
      }

      ArticlesService.updateArticle(knexInstance, article_id, articleToUpdate)
         .then(numbRowAffected => {
            res.status(204).end()
         })
         .catch(next)
   })

module.exports = articlesRouter