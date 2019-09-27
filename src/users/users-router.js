const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
   id: user.id,
   fullname: xss(user.fullname),
   username: xss(user.username),
   nickname: xss(user.nickname),
   date_created: user.date_created,
})

usersRouter
   .route('/')
   .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      UsersService.getAllUsers(knexInstance)
         .then(users => {
            res.json(users.map(serializeUser))
         })
         .catch(next)
   })
   .post(jsonParser, (req, res, next) => {
      const { fullname, username, nickname, password } = req.body
      const newUser = { fullname, username }
      const knexInstance = req.app.get('db')

      for(const [key, value] of Object.entries(newUser)){
         if(value === null){
            return res.status(400).json({ error: { message: `Missing '${key}' in request body` } })
         }
      }

      newUser.nickname = nickname;
      newUser.password = password;

      UsersService.insertUser(knexInstance, newUser)
         .then(user => {
            res.status(201).location(path.posix.join(req.originalUrl, `/${user.id}`)).json(serializeUser(user))
         })
         .catch(next)
   })

usersRouter
   .route('/:user_id')
   .all((req, res, next) => {
      const knexInstance = req.app.get('db')
      const { userId } = req.params
      UsersService.getById(knexInstance, userId)
         .then(user => {
            if(!user){
               return res.status(404).json({ error: { message: `User doesn't exist` } })
            }
            res.user = user
            next()
         })
         .catch(next)
   })
   .get((req, res, next) => {
      res.json(serializeUser(res.user))
   })
   .delete((req, res, next) => {
      const knexInstance = req.app.get('db')
      const { userId } = req.params
      UsersService.deleteUser(knexInstance, userId)
         .then(() => {
            res.status(204).end()
         })
         .catch(next)
   })
   .patch(jsonParser, (req, res, next) => {
      const { fullname, username, nickname, password } = req.body
      const userToUpdate = { fullname, username, nickname, password }
      const knexInstance = req.app.get('db')
      const { userId } = req.params

      const numberOfValues = Object.value(userToUpdate).filter(Boolean).length
      if(numberOfValues === 0){
         return res.status(400).json({ error: { message: `Request body must contain with 'fullname', 'username', 'password' or 'nickname'` } })
      }

      UsersService.updateUser(knexInstance, userId, userToUpdate)
         .then(() => {
            res.status(204).end()
         })
         .catch(next)
   })

module.exports = usersRouter