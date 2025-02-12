# Language Learning Portal - Frontend

A React-based frontend for the Language Learning Portal, built with TypeScript, Material-UI, and React Query.

## Features

- Study Activities Management
- Word Groups Organization
- Interactive Study Sessions
- Progress Tracking
- Performance Analytics
- Responsive Design

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- React Query
- React Router
- Axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── api/          # API client and type definitions
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── public/           # Static assets
└── package.json      # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## API Integration

The frontend communicates with the backend through RESTful APIs:

- Study Activities API (`/api/study-activities`)
- Groups API (`/api/groups`)
- Words API (`/api/words`)
- Study Sessions API (`/api/study-sessions`)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
