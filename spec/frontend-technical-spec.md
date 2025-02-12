# Frontend Technical Specification

## Architecture Overview

### Tech Stack Recommendations
- React 18+ with TypeScript
- State Management: Tanstack Query (React Query) for server state
- Routing: React Router v6
- UI Components: shadcn/ui
- Styling: Tailwind CSS
- Build Tool: Vite
- Testing: Vitest + React Testing Library
- E2E Testing: Playwright

### Global Types

```typescript
interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

interface StudySession {
  id: number;
  activity_name: string;
  group_name: string;
  start_time: string;
  end_time: string;
  review_items_count: number;
}

interface Word {
  french: string;
  english: string;
  correct_count: number;
  wrong_count: number;
}

interface Group {
  id: number;
  name: string;
  word_count: number;
}
```

## Page Specifications

### Dashboard (`/dashboard`)

#### State Management
```typescript
interface DashboardState {
  lastSession: {
    id: number;
    group_id: number;
    created_at: string;
    study_activity_id: number;
    group_name: string;
  };
  progress: {
    total_words_studied: number;
    total_available_words: number;
  };
  stats: {
    success_rate: number;
    total_study_sessions: number;
    total_active_groups: number;
    study_streak_days: number;
  };
}
```

#### Key Components
```typescript
// components/dashboard/LastStudySession.tsx
interface LastStudySessionProps {
  session: DashboardState['lastSession'];
  onGroupClick: (groupId: number) => void;
}

// components/dashboard/StudyProgress.tsx
interface StudyProgressProps {
  studied: number;
  total: number;
  mastery: number;
}

// components/dashboard/QuickStats.tsx
interface QuickStatsProps {
  stats: DashboardState['stats'];
}
```

#### Data Fetching
```typescript
// hooks/dashboard/useDashboardData.ts
const useDashboardData = () => {
  const lastSession = useQuery({
    queryKey: ['dashboard', 'lastSession'],
    queryFn: () => api.get('/api/dashboard/last_study_session')
  });
  
  const progress = useQuery({
    queryKey: ['dashboard', 'progress'],
    queryFn: () => api.get('/api/dashboard/study_progress')
  });
  
  const stats = useQuery({
    queryKey: ['dashboard', 'quickStats'],
    queryFn: () => api.get('/api/dashboard/quick-stats')
  });

  return { lastSession, progress, stats };
};
```

### Study Activities

#### Types
```typescript
interface StudyActivity {
  id: number;
  name: string;
  thumbnail_url: string;
  description: string;
}

interface StudyActivityLaunch {
  group_id: number;
  study_activity_id: number;
}
```

#### Components
```typescript
// components/study-activities/ActivityCard.tsx
interface ActivityCardProps {
  activity: StudyActivity;
  onLaunch: (activityId: number) => void;
  onView: (activityId: number) => void;
}

// components/study-activities/LaunchForm.tsx
interface LaunchFormProps {
  activityId: number;
  groups: Group[];
  onSubmit: (data: StudyActivityLaunch) => void;
}
```

### Words Management

#### Types
```typescript
interface WordDetails extends Word {
  groups: Array<{
    id: number;
    name: string;
  }>;
}
```

#### Components
```typescript
// components/words/WordList.tsx
interface WordListProps {
  words: Word[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onWordClick: (word: Word) => void;
}

// components/words/WordGroups.tsx
interface WordGroupsProps {
  groups: Array<{
    id: number;
    name: string;
  }>;
  onGroupClick: (groupId: number) => void;
}
```

### Groups Management

#### Types
```typescript
interface GroupDetails extends Group {
  stats: {
    total_word_count: number;
  };
}
```

#### Components
```typescript
// components/groups/GroupList.tsx
interface GroupListProps {
  groups: Group[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onGroupClick: (groupId: number) => void;
}

// components/groups/GroupStats.tsx
interface GroupStatsProps {
  stats: GroupDetails['stats'];
}
```

### Settings

#### Types
```typescript
type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: Theme;
}
```

#### Components
```typescript
// components/settings/ThemeSelector.tsx
interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

// components/settings/DangerZone.tsx
interface DangerZoneProps {
  onResetHistory: () => Promise<void>;
  onFullReset: () => Promise<void>;
}
```

## Shared Components

### Layout Components
```typescript
// components/layout/AppLayout.tsx
interface AppLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

// components/layout/PageHeader.tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}
```

### Data Display Components
```typescript
// components/shared/PaginatedTable.tsx
interface PaginatedTableProps<T> {
  data: T[];
  columns: Column[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

// components/shared/StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}
```

## State Management

### API Client
```typescript
// lib/api-client.ts
interface ApiClient {
  get: <T>(url: string) => Promise<T>;
  post: <T>(url: string, data?: unknown) => Promise<T>;
  put: <T>(url: string, data?: unknown) => Promise<T>;
  delete: <T>(url: string) => Promise<T>;
}
```

### Query Keys
```typescript
// lib/query-keys.ts
export const queryKeys = {
  dashboard: {
    all: ['dashboard'] as const,
    lastSession: ['dashboard', 'lastSession'] as const,
    progress: ['dashboard', 'progress'] as const,
    stats: ['dashboard', 'stats'] as const,
  },
  words: {
    all: ['words'] as const,
    list: (page: number) => ['words', 'list', page] as const,
    detail: (id: number) => ['words', 'detail', id] as const,
  },
  // ... other keys
} as const;
```

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Custom hooks testing
- Utility function testing

### Integration Tests
- Page component testing
- API integration testing
- State management testing

### E2E Tests
- Critical user flows
- Form submissions
- Navigation testing

## Build & Deployment

### Development
```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Testing
npm run test
npm run test:e2e

# Linting
npm run lint
```

### Production
```bash
# Build
npm run build

# Preview
npm run preview
```

## Error Handling

### Global Error Boundary
```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}
```

### API Error Handling
```typescript
interface ApiError {
  error: true;
  message: string;
  code: string;
}

// hooks/useApiError.ts
const useApiError = () => {
  const handleError = (error: ApiError) => {
    // Error handling logic
  };
  
  return { handleError };
};
```

## Performance Considerations

- Implement virtual scrolling for large lists
- Use React.memo for expensive components
- Implement proper query caching strategies
- Use code splitting for route-based components
- Implement proper loading states and skeletons

