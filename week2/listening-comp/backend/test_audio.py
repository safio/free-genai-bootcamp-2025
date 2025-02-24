import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.audio_generator import AudioGenerator

# Test question data
test_question = {
    "Introduction": "Martin présente son nom, sa nationalité et son âge.",
    "Conversation": """
    Bonjour je m'appelle Martin, je suis belge et j'ai 34 ans.
    """,
    "Question": "Comment s'appelle Martin?",
    "Options": [
        "a. Jean",
        "b. Martin",
        "c. Pierre",
        "d. Philippe"
    ]
}

def test_audio_generation():
    print("Initializing audio generator...")
    generator = AudioGenerator()
    
    print("\nParsing conversation...")
    parts = generator.parse_conversation(test_question)
    
    print("\nParsed conversation parts:")
    for speaker, text, gender, section in parts:
        print(f"Speaker: {speaker} ({gender}) - Section: {section}")
        print(f"Text: {text}")
        print("---")
    
    print("\nGenerating audio file...")
    audio_file = generator.generate_audio(test_question)
    print(f"Audio file generated: {audio_file}")
    
    return audio_file

if __name__ == "__main__":
    try:
        audio_file = test_audio_generation()
        print("\nTest completed successfully!")
        print(f"You can find the audio file at: {audio_file}")
    except Exception as e:
        print(f"\nError during test: {str(e)}")
