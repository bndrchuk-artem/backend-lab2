const storage = {
  users: {},
  categories: {},
  records: {},
  
  // Лічильники для генерації ID
  userIdCounter: 1,
  categoryIdCounter: 1,
  recordIdCounter: 1,
  
  // Початкові дані для тестування
  init() {
    this.users[1] = { id: 1, name: 'Іван Шевченко' };
    this.userIdCounter = 2;
    
    this.categories[1] = { id: 1, name: 'Продукти' };
    this.categories[2] = { id: 2, name: 'Транспорт' };
    this.categoryIdCounter = 3;
    
    this.records[1] = {
      id: 1,
      user_id: 1,
      category_id: 1,
      created_at: new Date().toISOString(),
      amount: 250.5
    };
    this.recordIdCounter = 2;
  }
};

storage.init();

module.exports = storage;