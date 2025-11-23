# Лабораторна 4

Варіант: `4 % 3 = 1` - Валюти

## Встановлення

### Вимоги

- Node.js версії 18 або вище
- npm
- Git
- Docker

### Кроки встановлення

1. **Клонуйте репозиторій:**
```bash
git clone --branch v4.0.0 https://github.com/bndrchuk-artem/backend-lab2
cd backend-lab2
```

2. **Встановіть залежності:**
```bash
npm install
```

## Запуск проекту

### Локальний запуск

```bash
# Запустіть контейнери
docker-compose up --build -d

# Виконайте міграції
docker-compose exec app npx sequelize-cli db:migrate
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
  "message": "Lab v4.0 (JWT Auth)",
  "status": "OK",
  "endpoints": {
    "public": {
      "register": "POST /register",
      "login": "POST /login"
    },
    "protected": {
      "me": "GET /me (current user info)",
      "users": "GET /users, GET /user/:id, DELETE /user/:id, PATCH /user/:id/default-currency",
      "categories": "GET /category, POST /category, DELETE /category/:id",
      "records": "GET /record, GET /record/:id, POST /record, DELETE /record/:id",
      "currencies": "GET /currency, POST /currency, DELETE /currency/:id"
    }
  },
  "note": "Protected endpoints require: Authorization: Bearer "
}
```

## API Документація

### Базова URL
Local: http://localhost:3000

Production: https://backend-lab2-x4wm.onrender.com/


## Публічні Endpoints (без токену)

### 1. Реєстрація користувача
```http
POST /register
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Іван Іваненко",
  "username": "ivan_test",
  "password": "securepass123",
  "default_currency_id": 1
}
```

**Відповідь (201 Created):**
```json
{
  "message": "User registered successfully. Please login to get access token.",
  "user": {
    "id": 1,
    "name": "Іван Іваненко",
    "username": "ivan_test",
    "default_currency_id": 1
  }
}
```


### 2. Логін користувача
```http
POST /login
Content-Type: application/json
```

**Body:**
```json
{
  "username": "ivan_test",
  "password": "securepass123"
}
```

**Відповідь (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Іван Іваненко",
    "username": "ivan_test",
    "default_currency_id": 1
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiaXZhbl90ZXN0IiwiaWF0IjoxNzAwNDg2NDAwLCJleHAiOjE3MDA1NzI4MDB9.xxxxx"
}
```

## Захищені Endpoints (потрібен токен)

**Всі наступні запити потребують заголовка:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Можливі помилки автентифікації:**
- `401` - `authorization_required` - Токен не наданий
- `401` - `token_expired` - Токен закінчився (термін дії: 24 години)
- `401` - `invalid_token` - Невалідний токен або підпис

## Користувачі

### 1. Отримати всіх користувачів
```http
GET /users
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 2. Отримати користувача за ID
```http
GET /user/:user_id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 3. Створити користувача
```http
POST /user
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

```json
{
  "name": "Іван",
  "default_currency_id": 1
}
```

### 4. Видалити користувача
```http
DELETE /user/:user_id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Примітка:** При видаленні користувача автоматично видаляються всі його записи про витрати.


## Категорії

### 1. Отримати всі категорії
```http
GET /category
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 2. Створити категорію
```http
POST /category
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```


### 3. Видалити категорію
```http
DELETE /category
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Записи про витрати

### 1. Отримати запис за ID
```http
GET /record/:record_id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 2. Отримати записи з фільтрацією
```http
GET /record?user_id={id}&category_id={id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Параметри запиту:**
- `user_id` (опціонально) - ID користувача
- `category_id` (опціонально) - ID категорії


**Приклади:**

Записи конкретного користувача:
```
GET /record?user_id=1
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Записи в конкретній категорії:
```
GET /record?category_id=2
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Записи користувача в конкретній категорії:
```
GET /record?user_id=1&category_id=2
Authorization: Bearer YOUR_ACCESS_TOKEN
```




### 3. Створити запис
```http
POST /record
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

```json
{
  "user_id": 1,
  "category_id": 1,
  "amount": 250.50,
  "currency_id": 1 //Опціонально
}  
```

### 4. Видалити запис
```http
DELETE /record/:record_id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Валюти
### 1. Отримати всі валюти
```http
GET /currency
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 2. Створити валюту
```http
POST /currency
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

```json
{
  "code": "PLN",
  "name": "Polish Zloty"
} 
```

### 3. Видалити валюту
```http
DELETE /currency/:id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 4. Змінити валюту користувача за замовчуванням
```http
PATCH /user/:user_id/default-currency
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```
```json
{
  "default_currency_id": 2
} 
```

## Структура даних

### User (Користувач)
```json
{
  "id": 1,
  "name": "Іван Тестер",
  "default_currency_id": 1,
  "createdAt": "2025-11-04T18:00:00.000Z",
  "updatedAt": "2025-11-04T18:00:00.000Z"
}
```

**Примітка:** Поле `password` ніколи не повертається в API відповідях.

### Category (Категорія)
```json
{
  "id": 1,
  "name": "Продукти"
}
```

### Record (Запис)
```json
{
  "id": 1,
  "amount": 250.5,
  "user_id": 1,
  "category_id": 1,
  "currency_id": 1,
  "createdAt": "2025-11-04T18:05:00.000Z"
}
```