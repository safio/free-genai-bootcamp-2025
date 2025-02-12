# Full-Stack Development Workflow Guide

## 🎯 Key Principles
- API-first development approach
- OpenAPI specification as single source of truth
- Type-safe frontend-backend integration
- Automated code generation for consistency

## 🔄 Development Workflow

### 1. API Contract First
Always start with API specification before implementation:
- Define endpoints structure in OpenAPI/Swagger
- Document request/response schemas
- Plan error handling and status codes
- Version your API from the start

### 2. Backend Development
```bash
# Generate OpenAPI documentation
npm run generate-docs  # Endpoint available at /api-docs

# Validate OpenAPI spec
npm run validate-spec
```

Key Points:
- Implement endpoints according to OpenAPI spec
- Set up automatic documentation generation
- Configure CORS for frontend access
- Use decorators/annotations for API documentation

### 3. Frontend Development
```bash
# Generate API client from OpenAPI spec
npm run generate-api

# Start development with API mocking
npm run dev:mock
```

Key Points:
- Generate TypeScript types from OpenAPI spec
- Use generated API clients for backend communication
- Set up API mocking for independent development

## 🛠️ Project Setup

### Prerequisites
- Node.js >= 16
- npm or yarn
- OpenAPI Generator CLI

### Installation
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install

# Install global tools
npm install -g @openapitools/openapi-generator-cli
```

### Available Scripts

Backend:
```bash
npm run dev          # Start development server
npm run docs         # Generate API documentation
npm run test         # Run tests
```

Frontend:
```bash
npm run generate-api # Generate API clients
npm run dev         # Start development server
npm run build       # Build for production
```

## 📋 Development Guidelines

### Adding New Endpoints

1. Update OpenAPI specification:
```yaml
/api/resource:
  get:
    summary: New endpoint description
    responses:
      200:
        description: Success response
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ResourceResponse'
```

2. Generate updated documentation and clients:
```bash
npm run generate-docs    # Backend
npm run generate-api     # Frontend
```

3. Implement endpoint in backend
4. Use generated client in frontend

### Best Practices

- Keep OpenAPI spec in version control
- Run `npm run generate-api` after pulling latest changes
- Use type-safe API clients instead of direct fetch/axios calls
- Write tests for API contracts
- Document breaking changes in API

## 🚫 Common Pitfalls

1. Frontend-Backend Desync
   - Solution: Always regenerate API clients after spec changes
   - Run `npm run generate-api` after pulling updates

2. CORS Issues
   - Configure backend to allow frontend origin
   - Set up proper CORS headers in development

3. Type Mismatches
   - Use generated types consistently
   - Validate request/response against schemas

## 📚 Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [API Design Best Practices](https://swagger.io/resources/articles/best-practices-in-api-design/)

## 🤝 Contributing

1. Update OpenAPI spec for new features
2. Generate updated clients: `npm run generate-api`
3. Implement changes
4. Submit PR with both spec and implementation

## 📝 License

MIT License - feel free to use and modify for your projects.
