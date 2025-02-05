# Sentence Constructor - AI Model Comparison

This project explores and compares different AI models' capabilities in sentence construction and language learning. Each directory contains implementations and experiments with different AI models.

## Project Structure

```
sentence-constructor/
├── chatgpt/         - ChatGPT implementation and results
├── claude/          - Claude AI implementation and results
├── deepseek/        - DeepSeek AI implementation and results
├── ollama_deepseek/ - Ollama-based DeepSeek implementation
└── perplexity/      - Perplexity AI implementation and results
```

## Development Environment

This project was developed using [Cursor](https://cursor.sh/)'s built-in AI capabilities. Cursor is an AI-first IDE that provides:
- Built-in Claude AI assistance
- Smart code completion and suggestions
- Intelligent code navigation
- Context-aware code understanding
- Real-time pair programming with AI

Cursor's AI assistant helped with:
- README generation and updates
- Documentation structure and consistency
- Code organization and best practices
- Real-time development guidance
- Project structure optimization

Note: This project uses Cursor's native AI capabilities powered by Claude, not GitHub Copilot.

## Model Implementations

### ChatGPT
- Implementation using ChatGPT Plus subscription
- Structured input files in .txt format
- XML-style content within text files
- Detailed state management (Setup, Attempt, Success)
- See `chatgpt/Readme.md` for specific details

### Claude
- Implementation details and results for Anthropic's Claude model
- See `claude/Readme.md` for specific details

### DeepSeek
- Custom prompt engineering approach
- Server availability considerations
- Interactive learning environment
- Detailed feedback system
- See `deepseek/Readme.md` for specific details

### Ollama DeepSeek
- Local implementation using Ollama with DeepSeek model
- See `ollama_deepseek/Readme.md` for specific details

### Perplexity
- Uses default Perplexity model
- No special prompting requirements
- Visual feedback with screenshots
- Structured learning approach
- See `perplexity/Readme.md` for specific details

## Common Features Across Models

### Learning States
1. Setup State
   - Vocabulary tables
   - Sentence structure examples
   - Initial guidance

2. Attempt State
   - User translation attempt
   - Detailed feedback
   - Correction suggestions
   - Progress tracking

3. Success State
   - Confirmation of correct answer
   - Explanation of grammar points
   - Positive reinforcement
   - Next steps

### File Structure
- Text-based input files (.txt)
- Screenshot documentation
- Structured examples
- Teaching prompts
- Test cases

## Purpose

This project aims to:
1. Compare different AI models' effectiveness in sentence construction
2. Evaluate each model's capabilities in language learning assistance
3. Document and analyze the results of various approaches
4. Provide insights into which model works best for specific use cases

## Getting Started

Each model's implementation is contained in its respective directory with its own README file containing:
- Setup instructions
- Implementation details
- Test results and screenshots
- Prompts used
- Performance analysis

## Documentation

- Each subdirectory contains detailed documentation
- Screenshots and examples are provided for visual reference
- Prompt templates and teaching strategies are documented
- Results and comparisons are available in each model's directory

## Best Practices

### File Management
- Keep files in .txt format for compatibility
- Use clear, structured formats
- Include comprehensive examples
- Document all prompts and responses

### Learning Approach
- Focus on interactive learning
- Provide detailed feedback
- Use progressive difficulty levels
- Maintain consistent structure

### Model-Specific Considerations
- Follow each model's prompting guidelines
- Consider server/API limitations
- Document any special requirements
- Track performance metrics

## Contributing

To add a new model implementation:
1. Create a new directory with the model name
2. Include a README.md with setup and usage instructions
3. Add relevant screenshots and examples
4. Document the prompts and strategies used
5. Include performance analysis and results

## License

This project is open source and available under the MIT License.
