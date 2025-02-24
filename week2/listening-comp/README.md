# French Listening Comprehension Practice

An interactive application for practicing French listening comprehension using AI-generated questions and audio content.

## Features

- AI-powered question generation for French listening practice
- Text-to-speech audio generation with natural French voices
- Vector-based similar question search
- Intelligent feedback on user answers
- Interactive web interface using Streamlit

## Prerequisites

- Python 3.8 or higher
- AWS credentials configured for Bedrock and Polly services
- FFmpeg installed for audio processing

## Installation

1. Clone the repository
2. Install frontend dependencies:
```sh
pip install -r requirements.txt
```
3. Install backend dependencies:
```sh
cd backend
pip install -r requirements.txt
cd ..
```

## Running the Application

### Frontend

Start the Streamlit web interface:

```sh
streamlit run frontend/main.py
```

### Backend

Run the backend server:

```sh
python backend/main.py
```

## Architecture

The application consists of:

- Frontend: Streamlit-based web interface
- Backend Services:
  - Question Generator: Creates contextual French listening questions
  - Audio Generator: Converts text to natural French speech
  - Vector Store: Manages similar question search
  - Chat Interface: Handles user interactions

## Usage

1. Access the web interface through your browser
2. Select a topic for practice
3. Listen to the generated audio question
4. Choose your answer from the options
5. Receive detailed feedback on your response