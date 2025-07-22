// Enhanced Developer Tools - Database Providers and Testing

export interface DatabaseProvider {
  id: string;
  name: string;
  type: 'relational' | 'document' | 'key-value' | 'graph' | 'time-series';
  description: string;
  connectionString: string;
  features: string[];
  supportedOperations: string[];
  icon: string;
  color: string;
  documentation: string;
}

export const DATABASE_PROVIDERS: Record<string, DatabaseProvider> = {
  postgresql: {
    id: 'postgresql',
    name: 'PostgreSQL',
    type: 'relational',
    description: 'Advanced open-source relational database',
    connectionString: 'postgresql://user:password@host:port/database',
    features: ['ACID Compliance', 'JSON Support', 'Full-text Search', 'Extensions'],
    supportedOperations: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRANSACTION', 'INDEX'],
    icon: '🐘',
    color: '#336791',
    documentation: 'https://www.postgresql.org/docs/'
  },
  
  mongodb: {
    id: 'mongodb',
    name: 'MongoDB',
    type: 'document',
    description: 'Flexible document-based NoSQL database',
    connectionString: 'mongodb://user:password@host:port/database',
    features: ['Document Storage', 'Dynamic Schemas', 'Horizontal Scaling', 'Aggregation'],
    supportedOperations: ['find', 'insertOne', 'updateOne', 'deleteOne', 'aggregate', 'index'],
    icon: '🍃',
    color: '#47A248',
    documentation: 'https://docs.mongodb.com/'
  },
  
  redis: {
    id: 'redis',
    name: 'Redis',
    type: 'key-value',
    description: 'In-memory data structure store for caching and real-time applications',
    connectionString: 'redis://user:password@host:port',
    features: ['In-Memory Storage', 'Data Structures', 'Pub/Sub', 'Persistence'],
    supportedOperations: ['GET', 'SET', 'HGET', 'LPUSH', 'SADD', 'EXPIRE'],
    icon: '⚡',
    color: '#DC382D',
    documentation: 'https://redis.io/documentation'
  },
  
  mysql: {
    id: 'mysql',
    name: 'MySQL',
    type: 'relational',
    description: 'Popular open-source relational database management system',
    connectionString: 'mysql://user:password@host:port/database',
    features: ['High Performance', 'Replication', 'Partitioning', 'Full-text Indexing'],
    supportedOperations: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRANSACTION', 'PROCEDURE'],
    icon: '🐬',
    color: '#4479A1',
    documentation: 'https://dev.mysql.com/doc/'
  },
  
  sqlite: {
    id: 'sqlite',
    name: 'SQLite',
    type: 'relational',
    description: 'Lightweight, file-based SQL database',
    connectionString: 'sqlite:///path/to/database.db',
    features: ['Zero Configuration', 'Self-contained', 'Cross-platform', 'Small Footprint'],
    supportedOperations: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRIGGER', 'VIEW'],
    icon: '📁',
    color: '#003B57',
    documentation: 'https://sqlite.org/docs.html'
  },
  
  neo4j: {
    id: 'neo4j',
    name: 'Neo4j',
    type: 'graph',
    description: 'Leading graph database for connected data',
    connectionString: 'neo4j://user:password@host:port',
    features: ['Graph Data Model', 'Cypher Query Language', 'ACID Transactions', 'Clustering'],
    supportedOperations: ['MATCH', 'CREATE', 'MERGE', 'DELETE', 'RETURN', 'WITH'],
    icon: '🕸️',
    color: '#008CC1',
    documentation: 'https://neo4j.com/docs/'
  },
  
  influxdb: {
    id: 'influxdb',
    name: 'InfluxDB',
    type: 'time-series',
    description: 'High-performance time-series database',
    connectionString: 'influxdb://user:password@host:port/database',
    features: ['Time-series Optimization', 'SQL-like Query Language', 'Data Retention', 'Continuous Queries'],
    supportedOperations: ['SELECT', 'INSERT', 'DELETE', 'SHOW', 'CREATE', 'DROP'],
    icon: '📈',
    color: '#22ADF6',
    documentation: 'https://docs.influxdata.com/'
  }
};

export interface TestingFramework {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  description: string;
  language: string[];
  features: string[];
  setupCommands: string[];
  exampleTest: string;
  documentation: string;
}

export const TESTING_FRAMEWORKS: Record<string, TestingFramework> = {
  jest: {
    id: 'jest',
    name: 'Jest',
    type: 'unit',
    description: 'Delightful JavaScript testing framework',
    language: ['JavaScript', 'TypeScript'],
    features: ['Zero Configuration', 'Snapshot Testing', 'Mocking', 'Code Coverage'],
    setupCommands: ['npm install --save-dev jest @types/jest'],
    exampleTest: `test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});`,
    documentation: 'https://jestjs.io/docs/'
  },
  
  vitest: {
    id: 'vitest',
    name: 'Vitest',
    type: 'unit',
    description: 'Next generation testing framework powered by Vite',
    language: ['JavaScript', 'TypeScript'],
    features: ['Fast Execution', 'ESM Support', 'TypeScript', 'Watch Mode'],
    setupCommands: ['npm install --save-dev vitest'],
    exampleTest: `import { test, expect } from 'vitest'

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3)
})`,
    documentation: 'https://vitest.dev/'
  },
  
  cypress: {
    id: 'cypress',
    name: 'Cypress',
    type: 'e2e',
    description: 'Fast, easy and reliable testing for anything that runs in a browser',
    language: ['JavaScript', 'TypeScript'],
    features: ['Real Browser Testing', 'Time Travel', 'Automatic Screenshots', 'Network Stubbing'],
    setupCommands: ['npm install --save-dev cypress'],
    exampleTest: `describe('My First Test', () => {
  it('Visits the app', () => {
    cy.visit('/')
    cy.contains('Welcome')
    cy.get('[data-cy=submit]').click()
  })
})`,
    documentation: 'https://docs.cypress.io/'
  },
  
  playwright: {
    id: 'playwright',
    name: 'Playwright',
    type: 'e2e',
    description: 'Fast and reliable end-to-end testing for modern web apps',
    language: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#'],
    features: ['Cross-browser Testing', 'Mobile Testing', 'API Testing', 'Visual Comparisons'],
    setupCommands: ['npm install --save-dev @playwright/test'],
    exampleTest: `import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Welcome');
});`,
    documentation: 'https://playwright.dev/docs/'
  },
  
  supertest: {
    id: 'supertest',
    name: 'Supertest',
    type: 'integration',
    description: 'HTTP assertion library for testing Node.js HTTP servers',
    language: ['JavaScript', 'TypeScript'],
    features: ['HTTP Testing', 'Express Integration', 'Assertion Library', 'Async Support'],
    setupCommands: ['npm install --save-dev supertest @types/supertest'],
    exampleTest: `import request from 'supertest';
import app from '../app';

test('GET /api/users', async () => {
  const response = await request(app)
    .get('/api/users')
    .expect(200);
    
  expect(response.body).toHaveProperty('users');
});`,
    documentation: 'https://github.com/visionmedia/supertest'
  },
  
  k6: {
    id: 'k6',
    name: 'k6',
    type: 'performance',
    description: 'Modern load testing tool for developers and testers',
    language: ['JavaScript'],
    features: ['Load Testing', 'Performance Monitoring', 'CI/CD Integration', 'Cloud & On-premise'],
    setupCommands: ['brew install k6', 'choco install k6', 'sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69'],
    exampleTest: `import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const response = http.get('https://test.k6.io/');
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
}`,
    documentation: 'https://k6.io/docs/'
  }
};

export const getDatabasesByType = (type: DatabaseProvider['type']): DatabaseProvider[] => {
  return Object.values(DATABASE_PROVIDERS).filter(db => db.type === type);
};

export const getTestingFrameworksByType = (type: TestingFramework['type']): TestingFramework[] => {
  return Object.values(TESTING_FRAMEWORKS).filter(framework => framework.type === type);
};

// Project Templates
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile';
  technologies: string[];
  features: string[];
  setupTime: string;
  popularity: number;
  scaffoldFiles: {
    path: string;
    content: string;
    language: string;
  }[];
}

export const PROJECT_TEMPLATES: Record<string, ProjectTemplate> = {
  'react-ts': {
    id: 'react-ts',
    name: 'React + TypeScript',
    description: 'Modern React application with TypeScript, Vite, and Tailwind CSS',
    category: 'frontend',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    features: ['Hot reload', 'TypeScript support', 'Modern bundling', 'CSS framework'],
    setupTime: '2 minutes',
    popularity: 4.8,
    scaffoldFiles: []
  },
  'next-app': {
    id: 'next-app',
    name: 'Next.js App Router',
    description: 'Full-stack Next.js application with App Router and server components',
    category: 'fullstack',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    features: ['App Router', 'Server components', 'File-based routing', 'API routes'],
    setupTime: '3 minutes',
    popularity: 4.9,
    scaffoldFiles: []
  },
  'vue-ts': {
    id: 'vue-ts',
    name: 'Vue 3 + TypeScript',
    description: 'Vue 3 application with Composition API and TypeScript',
    category: 'frontend',
    technologies: ['Vue 3', 'TypeScript', 'Vite', 'Pinia'],
    features: ['Composition API', 'State management', 'TypeScript', 'Hot reload'],
    setupTime: '2 minutes',
    popularity: 4.6,
    scaffoldFiles: []
  },
  'express-api': {
    id: 'express-api',
    name: 'Express.js API',
    description: 'RESTful API with Express.js, TypeScript, and PostgreSQL',
    category: 'backend',
    technologies: ['Express.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    features: ['REST API', 'Database ORM', 'Authentication', 'Validation'],
    setupTime: '4 minutes',
    popularity: 4.7,
    scaffoldFiles: []
  },
  'react-native': {
    id: 'react-native',
    name: 'React Native',
    description: 'Cross-platform mobile app with React Native and Expo',
    category: 'mobile',
    technologies: ['React Native', 'Expo', 'TypeScript', 'NativeWind'],
    features: ['Cross-platform', 'Native modules', 'Hot reload', 'App store ready'],
    setupTime: '5 minutes',
    popularity: 4.5,
    scaffoldFiles: []
  },
  'svelte-kit': {
    id: 'svelte-kit',
    name: 'SvelteKit',
    description: 'Full-stack SvelteKit application with TypeScript',
    category: 'fullstack',
    technologies: ['SvelteKit', 'TypeScript', 'Vite', 'Tailwind CSS'],
    features: ['Server-side rendering', 'File-based routing', 'Zero config', 'Fast builds'],
    setupTime: '3 minutes',
    popularity: 4.4,
    scaffoldFiles: []
  }
};