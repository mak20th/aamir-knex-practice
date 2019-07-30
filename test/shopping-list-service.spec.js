const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe('Items service object', function(){
  let db;
  let testItems =[
    {
      id: 1,
      name: 'First test item!',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      price: '12.00',
      category: 'Main'
    },
    {
      id: 2,
      name: 'Second test item!',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      price: '21.00',
      category: 'Snack'
    },
    {
      id: 3,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '3.00',
      category: 'Lunch'
    },
    {
      id: 4,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '0.99',
      category: 'Breakfast'
    },
  ];

  before(()=> {
    db = knex ({
      client:'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before (() => db('shopping_list').truncate());
  afterEach(()=> db('shopping_list').truncate());
  after(()=> db.destroy());

  context('Given "shopping_list" articles has data', () => {
    beforeEach(()=> {
      return db 
        .into('shopping_list')
        .insert(testItems);
    });
    
    it('getAllItems() resolves all items from shopping_list table', ()=>{
        const expected_item = testItems.map((item) =>({
            ...item,
            checked: false
        }));
        return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql(expected_item)
            });
    });

    it('getById() resolves an item from shopping_list table', ()=>{
        const secondId = 2;
        const secondItem = testItems[secondId - 1]
        return ShoppingListService.getById(db, secondId)
            .then(actual => {
                expect(actual).to.eql({
                    id: secondId,
                    name: secondItem.name,
                    date_added: secondItem.date_added,
                    price: secondItem.price,
                    category: secondItem.category,
                    checked: false,                    
                });
            });
    });

    it('deleteItem() removes an Item by id from shopping_list table', ()=>{
       const itemId = 3;
       return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allitems => {
            const expected = testItems
                .filter(item => item.id !== itemId)
                .map(item => ({
                    ...item,
                    checked: false
                }));
            expect(allItems).to.eql(expected)    
        });
    });

    it('updateItem() updates an article from the shopping_list table', () => {
        const itemToUpdateId = 3;
        const newItemData = {
            name: 'Updated Item from Aamir',
            date_added: new Date(),
            price: '0.25',            
            checked: false, 
        },
        const actualItem = testItems[itemToUpdateId - 1];
        return shoppingListService.updateItem('id', itemToUpdateId, newItemData)
            .then(() => shoppingListService.getById(db, itemToUpdateId))
            .then (item => {
                expect(item).to.eql({
                    id: itemToUpdateId
                    ...actualItem,
                    ...newItemData,
                });
            });
    });
  });

  context('Given shopping_list items has no data', () => {
      it('getAllItems() resolves an empty array', () => {
          return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql([])
            });
      });

      it('insertItem() inserts an item and resolves the new item with an ID', () => {
        const newItem = {
            name: 'Test new name name',
            price: '5.05',
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            checked: true,
            category: 'Lunch',
        }

        return ShoppingListService.insertItem('db', newItem)
            .then((actual) => {
                expect(actual).to.eql({
                    id:1,
                    name: newItem.name,
                    price: newItem.price,
                    date_added: new Date(newItem.date_added),
                    checked: newItem.checked,
                    category: newItem.category,
                });
            });
      });
  });
});