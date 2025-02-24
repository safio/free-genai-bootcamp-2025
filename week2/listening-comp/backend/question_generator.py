import boto3
import json
from typing import Dict, List, Optional
from backend.vector_store import QuestionVectorStore

class QuestionGenerator:
    def __init__(self):
        """Initialize Bedrock client and vector store"""
        self.bedrock_client = boto3.client('bedrock-runtime', region_name="us-east-1")
        self.vector_store = QuestionVectorStore()
        self.model_id = "amazon.nova-lite-v1:0"

    def _invoke_bedrock(self, prompt: str) -> Optional[str]:
        """Invoke Bedrock with the given prompt"""
        try:
            messages = [{
                "role": "user",
                "content": [{
                    "text": prompt
                }]
            }]
            
            response = self.bedrock_client.converse(
                modelId=self.model_id,
                messages=messages,
                inferenceConfig={"temperature": 0.1}
            )
            
            return response['output']['message']['content'][0]['text']
        except Exception as e:
            print(f"Error invoking Bedrock: {str(e)}")
            return None

    def generate_similar_question(self, topic: str) -> Dict:
        """Generate a new question similar to existing ones on a given topic"""
        # Get similar questions for context
        similar_questions = self.vector_store.search_similar_questions(topic, n_results=3)
        
        if not similar_questions:
            return None
        
        # Create context from similar questions
        context = "Here are some example French listening questions:\n\n"
        for idx, q in enumerate(similar_questions, 1):
            context += f"Example {idx}:\n"
            context += f"Situation: {q.get('Situation', q.get('Introduction', ''))}\n"
            context += f"Question: {q.get('Question', '')}\n"
            if 'Options' in q:
                context += "Options:\n"
                for i, opt in enumerate(q['Options'], 1):
                    context += f"{i}. {opt}\n"
            context += "\n"

        # Create prompt for generating new question
        prompt = f"""Based on the following example french listening questions, create a new question about {topic}.
The question should follow the same format but be different from the examples.
Make sure the question tests listening comprehension and has a clear correct answer.

Important rules:
1. The Introduction MUST explicitly state the key information needed to answer the Question with all details needed to answer the question
2. When creating the Introduction, include specific details about what will be asked in the Question
3. If the Question asks about specific details (like food, location, time), those EXACT details MUST be clearly mentioned in the Introduction
4. The correct answer should be directly stated or strongly implied in the Introduction
5. Keep the language level appropriate for French language learners
6. The Introduction should be written as a brief scenario description, not as dialogue
7. The Introduction should have a clear context with specific details and the question should have the conext with the Introduction

Format Requirements:
- Introduction: A paragraph providing detailed context and the necessary information to answer the question
- Question: A specific question testing comprehension of the information in the introduction
- Options: Four plausible choices with ONE clearly correct answer that matches information in the introduction

{context}

Generate a new question following the exact format above. Make sure the question is challenging but fair, and the options are plausible but with only one clearly correct answer. Return ONLY the question without any additional text.

BAD EXAMPLE:
Introduction: Julie parle de son équipe de football préférée.
Question: Quelle équipe de football est l'équipe préférée de Julie?
Options:
1. Paris Saint-Germain
2. Olympique de Marseille
3. Manchester United
4. Real Madrid
WHY : because the question is not about the team name but about the person's preference
New Question:
"""

        # Generate new question
        response = self._invoke_bedrock(prompt)
        if not response:
            return None

        # Parse the generated question
        try:
            lines = response.strip().split('\n')
            question = {}
            current_key = None
            current_value = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                if line.startswith("Introduction:"):
                    if current_key:
                        question[current_key] = ' '.join(current_value)
                    current_key = 'Introduction'
                    current_value = [line.replace("Introduction:", "").strip()]
                elif line.startswith("Conversation:"):
                    if current_key:
                        question[current_key] = ' '.join(current_value)
                    current_key = 'Conversation'
                    current_value = [line.replace("Conversation:", "").strip()]
                elif line.startswith("Situation:"):
                    if current_key:
                        question[current_key] = ' '.join(current_value)
                    current_key = 'Situation'
                    current_value = [line.replace("Situation:", "").strip()]
                elif line.startswith("Question:"):
                    if current_key:
                        question[current_key] = ' '.join(current_value)
                    current_key = 'Question'
                    current_value = [line.replace("Question:", "").strip()]
                elif line.startswith("Options:"):
                    if current_key:
                        question[current_key] = ' '.join(current_value)
                    current_key = 'Options'
                    current_value = []
                elif line[0].isdigit() and line[1] == "." and current_key == 'Options':
                    current_value.append(line[2:].strip())
                elif current_key:
                    current_value.append(line)
            
            if current_key:
                if current_key == 'Options':
                    question[current_key] = current_value
                else:
                    question[current_key] = ' '.join(current_value)
            
            # Ensure we have exactly 4 options
            if 'Options' not in question or len(question.get('Options', [])) != 4:
                # Use default options if we don't have exactly 4
                # Update this with your default options

                question['Options'] = [
                    "a. [option 1 in french]",
                    "b. [option 2 in french]",
                    "c. [option 3 in french]",
                    "d. [option 4 in french]"
                ]
            
            return question
        except Exception as e:
            print(f"Error parsing generated question: {str(e)}")
            return None

    def get_feedback(self, question: Dict, selected_answer: int) -> Dict:
        """Generate feedback for the selected answer"""
        if not question or 'Options' not in question:
            return None

        # Create prompt for generating feedback with clear JSON structure
        prompt = f"""You are a French language assessment expert. Carefully analyze this listening comprehension question and provide accurate feedback on the selected answer.

Context:
Situation: {question.get('Introduction', '')}
Question: {question['Question']}
Options:
{chr(10).join(f"{i}. {opt}" for i, opt in enumerate(question['Options'], 1))}

Selected Answer: {selected_answer}

IMPORTANT VALIDATION RULES:
1. You MUST carefully read the Situation/Introduction to identify the EXACT correct answer
2. The correct answer MUST be explicitly stated or directly implied in the Situation text
3. Do NOT make assumptions - only use information directly provided in the text
4. Double check that your feedback matches the actual context
5. Verify that the explanation references specific details from the Situation

Provide your assessment in the following JSON format. Ensure all fields are present and properly formatted:
{{
"correct": boolean,
"explanation": "clear explanation in French with specific references to the text",
"correct_answer": number
}}

Example response format:
{{
"correct": true,
"explanation": "Très bien! La réponse est correcte car le texte mentionne spécifiquement que...",
"correct_answer": 2
}}

Rules:
1. The explanation must be in French and reference specific details from the question
2. The correct_answer must be a number between 1 and 4
3. The explanation should be encouraging even for incorrect answers
4. Include word-for-word quotes from the situation that support the correct answer

Generate the feedback JSON now:"""

        # Get feedback with retry mechanism
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = self._invoke_bedrock(prompt)
                if not response:
                    continue

                # Clean and parse the JSON response
                response = response.strip()
                # Remove any text before the first '{' and after the last '}'
                start = response.find('{')
                end = response.rfind('}') + 1
                if start != -1 and end != 0:
                    response = response[start:end]

                feedback = json.loads(response)

                # Validate feedback structure
                if not isinstance(feedback, dict):
                    raise ValueError("Feedback must be a dictionary")

                required_fields = {'correct': bool, 'explanation': str, 'correct_answer': int}
                for field, field_type in required_fields.items():
                    if field not in feedback:
                        raise ValueError(f"Missing required field: {field}")
                    if not isinstance(feedback[field], field_type):
                        raise ValueError(f"Invalid type for {field}")

                # Validate correct_answer range
                if not 1 <= feedback['correct_answer'] <= 4:
                    raise ValueError("correct_answer must be between 1 and 4")

                # Additional validation to ensure feedback matches context
                if feedback['correct']:
                    # Verify that the explanation references the situation
                    situation = question.get('Introduction', '').lower()
                    explanation = feedback['explanation'].lower()
                    if not any(detail in explanation for detail in situation.split()):
                        raise ValueError("Explanation must reference specific details from the situation")

                return feedback

            except json.JSONDecodeError as e:
                print(f"Attempt {attempt + 1}: JSON parsing error - {str(e)}")
            except ValueError as e:
                print(f"Attempt {attempt + 1}: Validation error - {str(e)}")
            except Exception as e:
                print(f"Attempt {attempt + 1}: Unexpected error - {str(e)}")

        # If all retries failed, return a more informative error response
        return {
            "correct": False,
            "explanation": "Désolé, nous ne pouvons pas générer de feedback pour le moment. Veuillez réessayer.",
            "correct_answer": None
        }
if __name__ == "__main__":
    # Create an instance of QuestionGenerator
    generator = QuestionGenerator()
    
    # Test generating a similar question
    print("\nGenerating a similar question about 'Sports'...")
    question = generator.generate_similar_question("Sports")
    
    if question:
        print("\nGenerated Question:")
        print("Introduction:", question.get('Introduction', question.get('Situation', '')))
        print("Question:", question['Question'])
        print("\nOptions:")
        for i, option in enumerate(question['Options'], 1):
            print(f"{i}. {option}")
        
        # Test getting feedback
        print("\nTesting feedback for answer 1...")
        feedback = generator.get_feedback(question, 2)
        
        if feedback:
            print("\nFeedback:")
            print("Correct:", feedback['correct'])
            print("Explanation:", feedback['explanation'])
            print("Correct Answer:", feedback['correct_answer'])
    else:
        print("Failed to generate question")
