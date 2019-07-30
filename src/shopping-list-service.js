const shoppingListService = {
  //get all the items, use knex instance
  getAllItems(knex){
    return knex
      .select('*')
      .from('shopping_list');
  },

  //get by ID
  getById(knex, id){
    return knex
      .from('shopping_list')
      .select('*')
      .where('id', id)
      .first();
  },

  //insert an Item
  insertItem(knex, newItem){
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  //delete item
  deleteItem(knex, id){
    return knex('shopping_list')
      .where({id})
      .delete();
  },

  //update Item
  updateItem(knex, id, newItemfields){
    return knex('shopping_list')
      .where({id})
      .update(newItemfields);
  },
};

module.exports.shoppingListService;