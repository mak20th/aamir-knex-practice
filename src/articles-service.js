//object to export
//The first method inside the object is for getting all articles
const ArticlesService = {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // getAllArticles(){
  //   //return 'all the articles';// will get an error when running test file saying that .then() is not a function
  //   //because this code returns a string , not a promise. So we correct it below
  //   return Promise.resolve('all the articles');
  // }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //use the Knex instance to query the blogful_articles table
  getAllArticles(knex){
    return knex
      .select('*')
      .from('blogful_articles');
  },

  insertArticle(knex, newArticle){
    //return Promise.resolve({});
    return knex 
      .insert (newArticle)
      .into('blogful_articles')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from('blogful_articles')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteArticle(knex, id) {
    return knex('blogful_articles')
      .where({ id })
      .delete();
  },

  updateArticle(knex, id, newArticleFields) {
    return knex('blogful_articles')
      .where({ id })
      .update(newArticleFields);
  },

};
module.exports = ArticlesService;

//The first method is for getting all articles
