# Deepseek French Sentence Constructor

This is a sentence constructor that uses the Deepseek model to construct sentences in French, running locally through Ollama.

## Workspace Configuration

![Workspace Configuration](workspace_ollama.png)

### Key Settings
- Memory: Recommended 20 (max 45 to avoid chat failures)
- Temperature: 0.2 (for consistent, focused responses)
- Query mode refusal response: Customized for no-context scenarios

## Teaching Setup Example

![Teaching Setup Example](setup.png)

### Components Used
- Vocabulary Table: Maps English words to French equivalents
- Sentence Structure: Defines word order and grammar rules
- Teaching Clues: Provides helpful hints for sentence construction

## Example Attempt and Feedback

![Attempt State Example](AttemptState.png)

### Feedback Process
- Vocabulary check: Verifying correct word choices
- Structure analysis: Checking word order and grammar rules
- Constructive feedback: Highlighting successes and areas for improvement
- Interactive guidance: Offering additional clues when needed

## Final Answer Guidance

![Clues and Final Answer](Clues.png)

### Teaching Approach
- Acknowledge student effort
- Provide correct answer with explanation
- Break down grammatical components
- Encourage further practice
- Focus on learning process over memorization

## Features
- Local execution using Ollama
- French language sentence construction
- Customizable workspace settings
- Step-by-step teaching methodology
- Detailed feedback system
- Structured learning progression

## Setup
1. Install Ollama
2. Load the Deepseek model
3. Configure workspace settings as shown in the configuration image
4. Follow the teaching setup example for sentence construction

## Notes
- No official Deepseek prompt template is provided
- Custom prompt engineering may be required for optimal results

Add image of the prompt to teach.