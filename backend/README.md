# Language Learning Portal - Backend

A FastAPI-based backend for the Language Learning Portal, providing RESTful APIs for language learning management.

## Features

- RESTful API endpoints
- SQLAlchemy ORM with SQLite database
- Async support
- Pagination
- Data validation with Pydantic
- CORS middleware
- Automatic API documentation

## Tech Stack

- Python 3.9+
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- Uvicorn

## Getting Started

### Prerequisites

- Python 3.9 or higher
- pip
- virtualenv (recommended)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Create and activate virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Create a `.env` file
```bash
cp .env.example .env
```

5. Run the development server
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation will be at `http://localhost:8000/docs`

## Project Structure

```
backend/
├── app/
│   ├── api/           # API endpoints
│   ├── database/      # Database configuration
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   └── db/            # Database utilities
├── tests/             # Test files
└── requirements.txt   # Project dependencies
```

## API Endpoints

### Study Activities
- `GET /api/study-activities` - List all study activities
- `POST /api/study-activities` - Create a new study activity
- `GET /api/study-activities/{id}` - Get study activity details
- `PUT /api/study-activities/{id}` - Update study activity
- `DELETE /api/study-activities/{id}` - Delete study activity

### Groups
- `GET /api/groups` - List all groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/{id}` - Get group details
- `PUT /api/groups/{id}` - Update group
- `DELETE /api/groups/{id}` - Delete group
- `GET /api/groups/{id}/words` - Get words in a group

### Words
- `GET /api/words` - List all words
- `POST /api/words` - Create a new word
- `GET /api/words/{id}` - Get word details
- `PUT /api/words/{id}` - Update word
- `DELETE /api/words/{id}` - Delete word

### Study Sessions
- `GET /api/study-sessions` - List all study sessions
- `POST /api/study-sessions` - Create a new study session
- `GET /api/study-sessions/{id}` - Get session details
- `PUT /api/study-sessions/end` - End a study session
- `GET /api/study-sessions/progress` - Get session progress

## Development

### Running Tests
```bash
pytest
```

### Database Migrations
The project uses SQLite with SQLAlchemy. Database tables are created automatically on startup.

### Environment Variables
- `DATABASE_URL` - SQLite database URL
- `CORS_ORIGINS` - Allowed CORS origins
- `DEBUG` - Debug mode flag

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 