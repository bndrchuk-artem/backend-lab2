# Лабораторна 3

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
git clone --branch v3.0.0 https://github.com/bndrchuk-artem/backend-lab2
cd backend-lab2
```

2. **Встановіть залежності:**
```bash
npm install
```

## Запуск проекту

### Локальний запуск

```bash
docker-compose up --build
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
  "message": "Lab v3.0 (PostgreSQL)",
    "endpoints": {
      "users": "'/users, /user/:id'",
      "categories": "'/category'",
      "records": "/record, /record/:id",
      "currencies": "/currency"
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

```json
{
  "name": "Іван",
  "default_currency_id": 1
}
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
```

## Валюти
### 1. Отримати всі валюти
```http
GET /currency
```

### 2. Створити валюту
```http
POST /currency
Content-Type: application/json
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
```

### 4. Змінити валюту користувача за замовчуванням
```http
PATCH /user/:user_id/default-currency
Content-Type: application/json
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