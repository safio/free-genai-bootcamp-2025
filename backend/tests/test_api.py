from fastapi.testclient import TestClient
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database.database import get_db
from app.models.models import Base
from httpx import AsyncClient

# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Create test engine
engine = create_async_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Override the dependency
async def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        await db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_create_word(client: AsyncClient):
    response = await client.post(
        "/api/words/",
        json={"french": "bonjour", "english": "hello", "parts": {"part_of_speech": "interjection"}}
    )
    assert response.status_code == 200
    assert response.json()["french"] == "bonjour"

@pytest.mark.asyncio
async def test_get_words(client: AsyncClient):
    response = await client.get("/api/words/")
    assert response.status_code == 200
    assert "items" in response.json()
    assert "pagination" in response.json()

@pytest.mark.asyncio
async def test_search_words(client: AsyncClient):
    # First create a word to search for
    await client.post(
        "/api/words/",
        json={"french": "bonjour", "english": "hello"}
    )
    response = await client.get("/api/words/search/?query=bon&language=french")
    assert response.status_code == 200
    assert "items" in response.json()

@pytest.mark.asyncio
async def test_create_group(client: AsyncClient):
    response = await client.post("/api/groups/", json={"name": "Basic Greetings"})
    assert response.status_code == 200
    assert response.json()["name"] == "Basic Greetings"

@pytest.mark.asyncio
async def test_add_word_to_group(client: AsyncClient):
    word = (await client.post(
        "/api/words/",
        json={"french": "merci", "english": "thank you"}
    )).json()
    group = (await client.post("/api/groups/", json={"name": "Basic Phrases"})).json()
    
    response = await client.post(f"/api/groups/{group['id']}/words/{word['id']}")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_group_words(client: AsyncClient):
    # Create a group
    group = (await client.post("/api/groups/", json={"name": "Test Words Group"})).json()
    
    # Create and add multiple words to the group
    words = [
        {"french": "bonjour", "english": "hello"},
        {"french": "merci", "english": "thank you"},
        {"french": "au revoir", "english": "goodbye"}
    ]
    
    for word_data in words:
        word = (await client.post("/api/words/", json=word_data)).json()
        await client.post(f"/api/groups/{group['id']}/words/{word['id']}")
    
    # Test the paginated response with query parameters
    response = await client.get(f"/api/groups/{group['id']}/words")
    assert response.status_code == 200
    data = response.json()
    
    # Check response structure
    assert isinstance(data, dict)
    assert "items" in data
    assert isinstance(data["items"], list)
    
    # Check items content
    assert len(data["items"]) == len(words)
    
    # Verify word data
    for word in data["items"]:
        assert isinstance(word, dict)
        assert "id" in word
        assert "french" in word
        assert "english" in word
        assert isinstance(word["french"], str)
        assert isinstance(word["english"], str)
        assert isinstance(word["id"], int)

@pytest.mark.asyncio
async def test_create_study_activity(client: AsyncClient):
    response = await client.post(
        "/api/study-activities/",
        json={
            "name": "Vocabulary Quiz",
            "thumbnail_url": "https://example.com/thumb.jpg",
            "description": "Practice vocabulary"
        }
    )
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_create_study_session(client: AsyncClient):
    group = (await client.post("/api/groups/", json={"name": "Test Group"})).json()
    activity = (await client.post(
        "/api/study-activities/",
        json={"name": "Test Activity", "description": "Test"}
    )).json()
    
    response = await client.post(
        "/api/study-sessions/",
        json={"group_id": group["id"], "study_activity_id": activity["id"]}
    )
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_word_progress(client: AsyncClient):
    word = (await client.post(
        "/api/words/",
        json={"french": "au revoir", "english": "goodbye"}
    )).json()
    
    response = await client.get(f"/api/words/{word['id']}/progress")
    assert response.status_code == 200
    assert "success_rate" in response.json()

@pytest.mark.asyncio
async def test_session_progress(client: AsyncClient):
    group = (await client.post("/api/groups/", json={"name": "Test Group 2"})).json()
    activity = (await client.post(
        "/api/study-activities/",
        json={"name": "Test Activity 2", "description": "Test"}
    )).json()
    session = (await client.post(
        "/api/study-sessions/",
        json={"group_id": group["id"], "study_activity_id": activity["id"]}
    )).json()
    
    response = await client.get(f"/api/study-sessions/{session['id']}/progress")
    assert response.status_code == 200
    assert "success_rate" in response.json()

@pytest.mark.asyncio
async def test_dashboard_stats(client: AsyncClient):
    response = await client.get("/api/dashboard/stats")
    assert response.status_code == 200
    assert "success_rate" in response.json()
    assert "study_streak_days" in response.json()

@pytest.mark.asyncio
async def test_recent_sessions(client: AsyncClient):
    response = await client.get("/api/study-sessions/recent")
    assert response.status_code == 200
    assert "items" in response.json()

@pytest.mark.asyncio
async def test_delete_operations(client: AsyncClient):
    # Create and delete word
    word = (await client.post(
        "/api/words/",
        json={"french": "test", "english": "test"}
    )).json()
    response = await client.delete(f"/api/words/{word['id']}")
    assert response.status_code == 200
    
    # Create and delete group
    group = (await client.post("/api/groups/", json={"name": "Test Group"})).json()
    response = await client.delete(f"/api/groups/{group['id']}")
    assert response.status_code == 200
    
    # Create and delete study activity
    activity = (await client.post(
        "/api/study-activities/",
        json={"name": "Test Activity", "description": "Test"}
    )).json()
    response = await client.delete(f"/api/study-activities/{activity['id']}")
    assert response.status_code == 200 