const CommentsService = {
   getAllComments(knex){
      return knex.select('*').from('blogful_comments')
   },
   getById(knex, id){
      return knex
         .from('blogful_comments')
         .select('*')
         .where('id', id)
         .first()
   },
   insertComment(knex, newComment){
      return knex
         .insert(newComment)
         .into('blogful_comments')
         .returning('*')
         .then(rows => {
            return rows[0]
         })
   },
   deleteComment(knex, id){
      return knex
         .from('blogful_comments')
         .where('id', id)
         .delete()
   },
   updateComment(knex, id, newCommentFields){
      return knex
         .from('blogful_comments')
         .where('id', id)
         .update(newCommentFields)
   },
}

module.exports = CommentsService