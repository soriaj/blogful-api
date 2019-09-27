const ArticlesService = {
   getAllArticles(knex){
      // return Promise.resolve('all the articles!!')
      return knex.select('*').from('blogful_articles')
   },
   getById(knex, id){
      return knex.from('blogful_articles').select('*').where('id', id).first()
      
   },
   insertArticle(knex, newArticle){
      return knex
         .insert(newArticle)
         .into('blogful_articles')
         .returning('*')
         .then(rows => {
            return rows[0]
         })
   },
   deleteArticle(knex, id){
      return knex
         .from('blogful_articles')
         .where({ id })
         .delete()
   },
   updateArticle(knex, id, newArticleData){
      return knex
         .from('blogful_articles')
         .where({ id })
         .update(newArticleData)
   }
}

module.exports = ArticlesService;