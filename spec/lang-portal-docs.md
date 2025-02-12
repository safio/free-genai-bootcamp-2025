# Language Learning Portal Backend Documentation

## Overview
The Language Learning Portal is a prototype application designed to help users learn vocabulary in different languages. It serves three primary functions:
1. Managing an inventory of vocabulary words
2. Recording and tracking learning progress (Learning Record Store)
3. Providing a unified platform to launch various learning activities

## Technical Stack
- Backend Framework: Python with FastAPI
- Database: SQLite3
- API Format: JSON responses only
- Authentication: None (single-user system)

## Core Features

### 1. Vocabulary Management
- Storage and retrieval of vocabulary words (French-English pairs)
- Organization of words into thematic groups
- Association of words with multiple groups through many-to-many relationships
- Tracking of correct/incorrect attempts for each word

Example word record:
```json
{
  "id": 1,
  "french": "bonjour",
  "english": "hello",
  "parts": {
    "part_of_speech": "interjection",
    "context": ["greetings", "formal"]
  }
}
```

### 2. Study Sessions
- Creation and management of study sessions
- Association of sessions with specific word groups
- Recording of individual word reviews within sessions
- Tracking of session timing and progress

Example study session:
```json
{
  "id": 123,
  "group_id": 456,
  "created_at": "2025-02-08T17:20:23-05:00",
  "study_activity_id": 789,
  "group_name": "Basic Greetings",
  "review_items_count": 20
}
```

### 3. Learning Activities
- Support for different types of learning activities
- Activity-specific session tracking
- Performance metrics and statistics
- Progress tracking across different activities

Example activity:
```json
{
  "id": 1,
  "name": "Vocabulary Quiz",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "description": "Practice your vocabulary with flashcards"
}
```

### 4. Analytics Dashboard
- Quick statistics (success rate, study sessions, active groups)
- Study progress tracking
- Recent activity monitoring
- Study streak tracking

Example dashboard stats:
```json
{
  "success_rate": 80.0,
  "total_study_sessions": 4,
  "total_active_groups": 3,
  "study_streak_days": 4
}
```

## Database Structure

### Core Tables
1. `words`
   ```sql
   CREATE TABLE words (
     id INTEGER PRIMARY KEY,
     french TEXT NOT NULL,
     english TEXT NOT NULL,
     parts JSON
   );
   ```

2. `groups`
   ```sql
   CREATE TABLE groups (
     id INTEGER PRIMARY KEY,
     name TEXT NOT NULL
   );
   ```

3. `words_groups`
   ```sql
   CREATE TABLE words_groups (
     id INTEGER PRIMARY KEY,
     word_id INTEGER REFERENCES words(id),
     group_id INTEGER REFERENCES groups(id)
   );
   ```

### Learning Record Store Tables
1. `study_sessions`
   ```sql
   CREATE TABLE study_sessions (
     id INTEGER PRIMARY KEY,
     group_id INTEGER REFERENCES groups(id),
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     study_activity_id INTEGER REFERENCES study_activities(id)
   );
   ```

2. `study_activities`
   ```sql
   CREATE TABLE study_activities (
     id INTEGER PRIMARY KEY,
     study_session_id INTEGER REFERENCES study_sessions(id),
     group_id INTEGER REFERENCES groups(id),
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. `word_review_items`
   ```sql
   CREATE TABLE word_review_items (
     word_id INTEGER REFERENCES words(id),
     study_session_id INTEGER REFERENCES study_sessions(id),
     correct BOOLEAN,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

## API Endpoints

### Dashboard Endpoints

#### `GET /api/dashboard/last_study_session`
Response:
```json
{
  "id": 123,
  "group_id": 456,
  "created_at": "2025-02-08T17:20:23-05:00",
  "study_activity_id": 789,
  "group_name": "Basic Greetings"
}
```

#### `GET /api/dashboard/study_progress`
Response:
```json
{
  "total_words_studied": 3,
  "total_available_words": 124
}
```

#### `GET /api/dashboard/quick-stats`
Response:
```json
{
  "success_rate": 80.0,
  "total_study_sessions": 4,
  "total_active_groups": 3,
  "study_streak_days": 4
}
```

### Word Management

#### `GET /api/words`
Response:
```json
{
  "items": [
    {
      "french": "bonjour",
      "english": "hello",
      "correct_count": 5,
      "wrong_count": 2
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 500,
    "items_per_page": 100
  }
}
```

#### `GET /api/words/:id`
Response:
```json
{
  "french": "bonjour",
  "english": "hello",
  "correct_count": 5,
  "wrong_count": 2,
  "groups": [
    {
      "id": 1,
      "name": "Basic Greetings"
    }
  ]
}
```

### Group Management

#### `GET /api/groups`
Response:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Basic Greetings",
      "word_count": 20
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 10,
    "items_per_page": 100
  }
}
```

### Study Session Management

#### `POST /api/study_sessions/:id/words/:word_id/review`
Request:
```json
{
  "correct": true
}
```

Response:
```json
{
  "success": true,
  "word_id": 1,
  "study_session_id": 123,
  "correct": true,
  "created_at": "2025-02-08T17:33:07-05:00"
}
```

## Data Management Tasks

### Database Initialization
Example migration file (`0001_init.sql`):
```sql
CREATE TABLE words (
  id INTEGER PRIMARY KEY,
  french TEXT NOT NULL,
  english TEXT NOT NULL,
  parts JSON
);

CREATE TABLE groups (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
```

### Data Seeding
Example seed file (`basic_greetings.json`):
```json
[
  {
    "french": "bonjour",
    "english": "hello"
  },
  {
    "french": "au revoir",
    "english": "goodbye"
  },
  {
    "french": "s'il vous plaît",
    "english": "please"
  }
]
```

Example seed configuration:
```toml
[[seeds]]
file = "basic_greetings.json"
group = "Basic Greetings"

[[seeds]]
file = "numbers.json"
group = "Numbers 1-20"
```

## Implementation Notes

### Pagination
Standard pagination response format:
```json
{
  "current_page": 1,
  "total_pages": 5,
  "total_items": 100,
  "items_per_page": 100
}
```

### Error Handling
Example error response:
```json
{
  "error": true,
  "message": "Resource not found",
  "code": "NOT_FOUND"
}
```

