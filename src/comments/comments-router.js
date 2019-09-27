const path = require('path')
const express = require('express')
const xss = require('xss')
const CommentsService = require('./comments-service')

const commentsRouter = express.Router()
const jsonParser = express.json()

const serializeComment = comment => ({
   id: comment.id,
   text: xss(comment.text),
   date_commented: comment.date_commented,
   article_id: comment.article_id,
   user_id: comment.user_id,
})

commentsRouter
   .route('/')
   .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      CommentsService.getAllComments(knexInstance)
         .then(comments => {
            res.json(comments.map(serializeComment(comments)))
         })
         .catch(next)
   })
   .post(jsonParser, (req, res, next) => {
      const { text, article_id, user_id, date_commented } = req.body
      const newComment = { text, article_id, user_id }
      const knexInstance = req.app.get('db')
      
      for(const [key, value] of Object.entries(newComment)){
         if(value === null){
            return res.status(400).json({ error: { message: ` Missing '${key}' in request body` } })
         }
      }

      newComment.date_commented = date_commented;

      CommentsService.insertComment(knexInstance, newComment)
      .then(comment => {
         res.status(201).location(path.posix.join(req.originalUrl, `/${comment.id}`)).json(serializeComment(comment))
      })
      .catch(next)
   })

