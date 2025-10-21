# Expense Tracker API

REST API для обліку витрат. Застосунок дозволяє створювати користувачів, категорії витрат та записи про витрати з можливістю фільтрації.

## Технології

- **Node.js** (v18+)
- **Express.js**


## Встановлення

### Вимоги

- Node.js версії 18 або вище
- npm
- Git

### Кроки встановлення

1. **Клонуйте репозиторій:**
```bash
git clone https://github.com/bndrchuk-artem/backend-lab2
cd backend-lab2
```

2. **Встановіть залежності:**
```bash
npm install
```

## Запуск проекту

### Локальний запуск

**Режим розробки з автоматичним перезапуском:**
```bash
npm run dev
```

**Звичайний режим:**
```bash
npm start
```

Сервер буде доступний за адресою: **http://localhost:3000**

### Перевірка роботи

Відкрийте браузер або Postman і перейдіть за адресою:
```
http://localhost:3000
```

Ви маєте побачити:
```json
{
  "message": "Expense Tracker API",
  "endpoints": {
    "users": "/users, /user/:id",
    "categories": "/category",
    "records": "/record, /record/:id"
  }
}
```

## API Документація

### Базова URL
Local: http://localhost:3000

Production: https://backend-lab2-x4wm.onrender.com/


## Користувачі

### 1. Отримати всіх користувачів
```http
GET /users
```

### 2. Отримати користувача за ID
```http
GET /user/:user_id
```

### 3. Створити користувача
```http
POST /user
Content-Type: application/json
```

### 4. Видалити користувача
```http
DELETE /user/:user_id
```

**Примітка:** При видаленні користувача автоматично видаляються всі його записи про витрати.


## Категорії

### 1. Отримати всі категорії
```http
GET /category
```

### 2. Створити категорію
```http
POST /category
Content-Type: application/json
```


### 3. Видалити категорію
```http
DELETE /category
Content-Type: application/json
```

## Записи про витрати

### 1. Отримати запис за ID
```http
GET /record/:record_id
```

### 2. Отримати записи з фільтрацією
```http
GET /record?user_id={id}&category_id={id}
```

**Параметри запиту:**
- `user_id` (опціонально) - ID користувача
- `category_id` (опціонально) - ID категорії


**Приклади:**

Записи конкретного користувача:
```
GET /record?user_id=1
```

Записи в конкретній категорії:
```
GET /record?category_id=2
```

Записи користувача в конкретній категорії:
```
GET /record?user_id=1&category_id=2
```




### 3. Створити запис
```http
POST /record
Content-Type: application/json
```


### 4. Видалити запис
```http
DELETE /record/:record_id
```

## Структура даних

### User (Користувач)
```javascript
{
  id: Number,
  name: String
}
```

### Category (Категорія)
```javascript
{
  id: Number,
  name: String
}
```

### Record (Запис)
```javascript
{
  id: Number,
  user_id: Number,
  category_id: Number,
  created_at: String,
  amount: Number
}
```