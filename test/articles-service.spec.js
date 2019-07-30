/*
1)  The test will need to know what data is in the database table, let's call this the expected data.
We can call this the "state" of the database table. So, the test should put some data into the database,
then the test can be sure of the table's state.
2)  The test will need to call the method and check what data the method resolves, let's call this the actual data.
3)  The test will need to check that the actual values match the expected. If the two values match, we'll know 
that the method retrieved the data from the database.
4)  We should try the method when the database table is in different states so that we can be very sure that the
     method correctly reflects the table's state.
*/
//~~~~~~~~Initial test to see failed test and confirm that test is running~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// describe('Articles service object', function(){
//   it('should run the tests', ()=>{
//     expect(true). to.eql(false);
//   });
// });
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const ArticlesService = require ('../src/articles-service');
// In order for the test file to insert data into the database, we'll need 2 things:
//1)A connection to the database! We can make a Knex instance in the tests
//2)The test data, let's call this testArticles
const knex = require('knex'); // for the connection to the database

describe('Articles service object', function(){
  let db; 
  //test data, an array of articles we put into the database and then can later check against what is resolved by calling getAllArticles()
  let testArticles = [
    {
      id: 1,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
      title: 'First test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 2,
      date_published: new Date('2100-05-22T16:28:32.615Z'),
      title: 'Second test post!',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
    },
    {
      id: 3,
      date_published: new Date('1919-12-22T16:28:32.615Z'),
      title: 'Third test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
    },
  ];

  //make the Knex instance before the tests run and save it in a variable called db.
  // We'll use the TEST_DB_URL to connect to the test database.
  // before() is a mocha method that runs before any of the tests it books. aka hooks 
  before(() => { 
    db = knex ({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
  });

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //We need to clear the table so we have a fresh start every time we run the tests. 
  //The truncate method will remove all of the data from a table.
  before (()=> db('blogful_articles').truncate());

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //Test leak is when one test is affecting another test, every test should clean up after itself. We can use an afterEach
  // block to remove all of the data after each tes
  afterEach(() => db('blogful_articles').truncate())

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //we need to disconnect from the database at the end of all the tests.
  after(() => db.destroy());  
  
  //~~~~~~~~~~~~Describe/Context block for NON empty test~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  context('Given blogful_articles has data',() => { //we're setting a "context" of state for a group of tests.
     //Insert the test articles into the test database before the tests. 
    //The knexInstance.insert() method also returns a promise; so we can utilize the features 
    //of mocha by returning that promise from the before callback function and mocha will wait 
    //for the SQL insert to complete before executing the tests.

    beforeEach(()=>{
      return db  //knexInstance
        .into('blogful_articles')
        .insert(testArticles);
    });
       
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
    it('getAllArticles() resolves all articles from blogful_articles table', () => {
      //test that ArticlesService.getAllArticles gets data from table
      //return ArticlesService.getAllArticles()
      //update the test code to inject the Knex instance
      return ArticlesService.getAllArticles(db)
        .then(actual => {
          //expect(actual).to.eql(testArticles);
          //If you're having issues with the dates being slightly different, 
          //change the endpoint handler to run each article's date_published through a new Date constructor:
          expect(actual).to.eql(testArticles.map(article => ({
            ...article,
            date_published: new Date(article.date_published)
          })))
        })
    })

    //~~~~~~~~~~~~~~~~~~Getting specific article by ID~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
it('getById() resolves an article by id from blogful_articles table', () => {
  const thirdId = 3;
  const thirdTestArticle = testArticles[thirdId - 1]
  return ArticlesService.getById(db, thirdId)
    .then(actual => {
      expect(actual).to.eql({
        id: thirdId,
        title: thirdTestArticle.title,
        content: thirdTestArticle.content,
        date_published: thirdTestArticle.date_published,
      })
    })
})
//~~~~~~~~~~~~~DELETE ARTICLE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
it('deleteArticle() removes an article by id from blogful_articles table', () => {
  const articleId = 3;
  return ArticlesService.deleteArticle(db, articleId)
    .then(() => ArticlesService.getAllArticles(db))
    .then(allArticles => {
      // copy the test articles array without the "deleted" article
      const expected = testArticles
        .filter(article => article.id !== articleId)
        expect(allArticles).to.eql(expected)
    })
})

//~~~~Update Article~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
it('updateArticle() updates an article from the blogful_articles table', () => {
  const idOfArticleToUpdate = 3;
  const newArticleData = {
    title: 'updated title',
    content: 'updated content',
    date_published: new Date(),
  }
  return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
    .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
    .then(article => {
      expect(article).to.eql({
        id: idOfArticleToUpdate,
        ...newArticleData,
      })
    })
})
  })
  //~~~~~~~~~~~~~~~~~~~~~~~Describe/context block for empty database table~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    context('Given blogful_articles has no data', () => {
       it(`getAllArticles() resolves an empty array`, () => {
         return ArticlesService.getAllArticles(db)
           .then(actual => {
             expect(actual).to.eql([])
          })
       })
    })

  //~~~~~~~~~~~~~~~~Adding Articles~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //method when the table has no data
    //method should also return the newly created article, including the id. The id value should be auto incremented and not specified
    it('insertArticle() inserts a new article and resolves the new article with an ID', () => {
    //make an object that represents the new article we'll insert.
      const newArticle = {
        title: 'Test new tile',
        content: 'Testing new content',
        date_published: new Date ('2020-01-01T00:00:00.000Z'),
      }

    //test to assert that the method resolves the newly created article with an incremented ID. The ID should be '1', as the table is empty.
       return ArticlesService.insertArticle(db, newArticle)
        .then(actual => {
          expect(actual).to.eql({
            id:1,
            title: newArticle.title,
            content: newArticle.content,
          //date_published: newArticle.date_published,
            date_published: new Date(newArticle.date_published), //if having issue with date us this code
          })
        })
    })
   
  

});