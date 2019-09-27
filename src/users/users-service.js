const UsersService = {
   getAllUsers(knex){
      return knex.select('*').from('blogful_users')
   },
   getById(knex, id){
      return knex
         .from('blogful_users')
         .select('*')
         .where('id', id)
         .first()
   },
   insertUser(knex, newUser){
      return knex
         .insert(newUser)
         .into('blogful_users')
         .returning('*')
         .then(rows => {
            return rows[0]
         })
   },
   deleteUser(knex, id){
      return knex
         .from('blogful_users')
         .where('id', id)
         .delete()
   },
   updateUser(knex, id, newUserFields){
      return knex
         .from('blogful_users')
         .where('id', id)
         .update(newUserFields)
   },
}

module.exports = UsersService