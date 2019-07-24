require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});
console.log('connection successful');

function searchByName(searchTerm){
  knexInstance
    .select('id', 'name','price', 'date_added', 'checked','category')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

function paginateItems(pageNumber){
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber-1);
  knexInstance
    .select('id', 'name','price', 'date_added', 'checked','category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result =>{
      console.log(result);
    });
}

function getItemsAfterDate(daysAgo){
  knexInstance
    .select('id', 'name','price', 'date_added', 'checked','category')
    .from('shopping_list')
    .where('date_added' > ('now() - \'?? days\':: INTERVAL', daysAgo))
    .then(result => {
      console.log(results);
    });
}

function totalCostPerCategory(){
  knexInstance
    .select('category')
    .sum('price AS total')
    .from('shopping_list')
    .groupBy('category')
    .then (result => {
      console.log('price per category is '+ result);
    });
}