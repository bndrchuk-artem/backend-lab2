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
    this.users[2] = { id: 2, name: 'Іван Кравченко' };
    this.userIdCounter = 3;
    
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

    this.records[2] = {
      id: 2,
      user_id: 2,
      category_id: 1,
      created_at: new Date().toISOString(),
      amount: 150
    };

    this.records[3] = {
      id: 3,
      user_id: 2,
      category_id: 2,
      created_at: new Date().toISOString(),
      amount: 220.5
    };

    this.records[4] = {
      id: 4,
      user_id: 1,
      category_id: 1,
      created_at: new Date().toISOString(),
      amount: 1220.5
    };
    this.recordIdCounter = 5;
  }
};

storage.init();

module.exports = storage;