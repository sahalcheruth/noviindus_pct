# Flight Routes System

A Django REST Framework application developed as part of a Django Machine Test. The application manages airport routes and provides APIs to search routes, identify the airport with the longest duration, and identify the airport with the shortest duration.

---

## Features

- Airport CRUD APIs
- JWT Authentication
- Search Last Reachable Airport (Left / Right)
- Find Airport with Longest Duration
- Find Airport with Shortest Duration
- Input Validation
- Protected Create, Update and Delete APIs

---

## Technologies Used

- Python 3
- Django
- Django REST Framework
- JWT Authentication (Simple JWT)
- SQLite

---

## Installation

### Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

```bash
cd <PROJECT_FOLDER>
```

---

### Create Virtual Environment

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---


## Environment Variables

Create a `.env` file in the project root using the provided `.env.example`.

Example:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
```

### Run Database Migrations

```bash
python manage.py migrate
```

---

### Start Development Server

```bash
python manage.py runserver
```

Server will start at:

```
http://127.0.0.1:8000/
```

---


## Create Superuser

If the project is being set up for the first time, create a Django superuser:

```bash
python manage.py createsuperuser
```

Example:

```text
Username: admin
Email: admin@example.com
Password: ********
```

---


## Admin Credentials

Use the following credentials to obtain a JWT token.

**Username**

```
admin
```

**Password**

```

```

---

## JWT Authentication

### Generate Access Token

**POST**

```
/api/token/
```

Request Body

```json
{
    "username": "admin",
    "password": "your_password"
}
```

Response

```json
{
    "refresh": "<refresh_token>",
    "access": "<access_token>"
}
```

Use the Access Token in the Authorization header.

```
Authorization: Bearer <access_token>
```

---

# API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/token/ |

---

## Airport APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/airports/ | List Airports |
| POST | /api/airports/ | Create Airport *(Authentication Required)* |
| GET | /api/airports/{id}/ | Retrieve Airport |
| PUT | /api/airports/{id}/ | Update Airport *(Authentication Required)* |
| PATCH | /api/airports/{id}/ | Partial Update *(Authentication Required)* |
| DELETE | /api/airports/{id}/ | Delete Airport *(Authentication Required)* |

---

## Search Route API

### POST

```
/api/airports/search-route/
```

Request

```json
{
    "airport_code": "MAA",
    "direction": "right"
}
```

Sample Response

```json
{
    "start_airport": "MAA",
    "direction": "right",
    "last_reachable_airport": "DEL"
}
```

---

## Longest Duration API

### GET

```
/api/airports/longest-duration/
```

Sample Response

```json
{
    "airport": "DEL",
    "duration": 60
}
```

---

## Shortest Duration API

### GET

```
/api/airports/shortest-duration/
```

Sample Response

```json
{
    "airport": "MAA",
    "duration": 20
}
```

---

## Project Structure

```
project/
│
├── airport/
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── services.py
│   ├── views.py
│   └── urls.py
│
├── config/
│
├── db.sqlite3
├── manage.py
├── requirements.txt
└── README.md
```

---


GitHub: https://github.com/<your_username>