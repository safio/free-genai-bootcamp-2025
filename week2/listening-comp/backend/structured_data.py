from typing import Optional, Dict, List
import boto3
import os

# Model ID
#MODEL_ID = "amazon.nova-micro-v1:0"
MODEL_ID = "amazon.nova-lite-v1:0"

class TranscriptStructurer:
    def __init__(self, model_id: str = MODEL_ID):
        """Initialize Bedrock client"""
        self.bedrock_client = boto3.client('bedrock-runtime', region_name="us-east-1")
        self.model_id = model_id
        self.prompts = {1: """Extract questions from this transcript where the answer can be determined solely from the conversation without needing visual aids.
            
ONLY include questions that meet these criteria:
- The answer can be determined purely from the spoken dialogue
- No spatial/visual information is needed (like locations, layouts, or physical appearances)
- No physical objects or visual choices need to be compared
            
For example, INCLUDE questions about:
- Times and dates
- Numbers and quantities
- Spoken choices or decisions
- Clear verbal directions
- Information from conversations
- Details from announcements or radio segments
- Contextual information
- Specific details or facts from the conversation

Format each question exactly like this:

<question>
    Introduction:
    [french introduction in french]

    Conversation:
    [conversation in french]

    Question:
    [french question in french]

    Options:
    a. [option 1 in french]
    b. [option 2 in french]
    c. [option 3 in french]
    d. [option 4 in french]
    
    Answer:
    [answer in french   one of a, b, c, d]
</question>

Rules:
- Only extract questions from the TEF transcript
- Only include questions where answers can be determined from dialogue alone
- Ignore any practice examples (marked with "Exemple")
- Do not translate any French text
- Do not include any section descriptions or other text
- Output questions one after another with no extra text between them
- remove all text about music or sound  
"""}

    def _invoke_bedrock(self, prompt: str, transcript: str) -> Optional[str]:
        """Make a single call to Bedrock with the given prompt"""
        full_prompt = f"{prompt}\n\nHere's the transcript:\n{transcript}"
        
        messages = [{
            "role": "user",
            "content": [{"text": full_prompt}]
        }]

        try:
            response = self.bedrock_client.converse(
                modelId=self.model_id,
                messages=messages,
                inferenceConfig={"temperature": 0}
            )
            print(response)
            return response['output']['message']['content'][0]['text']
        except Exception as e:
            print(f"Error invoking Bedrock: {str(e)}")
            return None

    def structure_transcript(self, transcript: str) -> str:
        """Structure the transcript into questions"""
        return self._invoke_bedrock(self.prompts[1], transcript)

    def save_questions(self, structured_content: str, base_filename: str) -> bool:
        """Save questions to a file"""
        try:
            # Create questions directory if it doesn't exist
            os.makedirs(os.path.dirname(base_filename), exist_ok=True)
            
            # Save questions
            with open(base_filename, 'w', encoding='utf-8') as f:
                f.write(structured_content)
            return True
        except Exception as e:
            print(f"Error saving questions: {str(e)}")
            return False

    def load_transcript(self, filename: str) -> Optional[str]:
        """Load transcript from a file"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"Error loading transcript: {str(e)}")
            return None

if __name__ == "__main__":
    structurer = TranscriptStructurer()
    transcript = structurer.load_transcript("data/transcripts/wqkIJLMR-bA.txt")
    if transcript:
        structured_sections = structurer.structure_transcript(transcript)
        structurer.save_questions(structured_sections, "data/questions/wqkIJLMR.txt")