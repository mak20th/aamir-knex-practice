require('dotenv').config();
//connect and create knex instance
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});
console.log('connection successful');

//~~~~~~~~~~~~~~Building Queries~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// const q1 = knexInstance('amazong_products').select('*').toQuery();
// const q2 = knexInstance.from('amazong_products').select('*').toQuery();

// console.log('q1:', q1);

// console.log('q2:', q2);
//~~~~~~~~Builidng QUeries similar to above but using .then~~~~~~~~~~~~~~~~~~~~~~~~~
// knexInstance.from('amazong_products').select('*')
//   .then(result => {
//     console.log(result);
//   });
//modify the query to select the identifier, name, price, and category of one product.
const qry = knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'screwdriver' })
  .first() 
  .toQuery();//modified slightly to chain the .first method that will only select the first item found
//.then(result => {
//console.log(result);
//});

console.log(qry);

//We'll put it in a function that accepts the searchTerm as a parameter so that we can use the word that
// Michael decides when he's ready.
function searchByProduceName(searchTerm) {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}
  
// searchByProduceName('holo')
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// build a query that allows customers to paginate the amazong_products
// table products, 10 products at a time
function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}
  
//paginateProducts(2);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//build a query that allows customers to filter the amazong_products
// table for products that have images.
function getProductsWithImages() {
  knexInstance
    .select('product_id', 'name', 'price', 'category', 'image')
    .from('amazong_products')
    .whereNotNull('image')
    .then(result => {
      console.log(result);
    });
}
  
getProductsWithImages();

//build a query that allows customers to see the most popular videos by view at Whopipe
// by region for the last 30 days.
function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw('now() - \'?? days\'::INTERVAL', days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    .then(result => {
      console.log(result);
    });
}
  
mostPopularVideosForDays(30);