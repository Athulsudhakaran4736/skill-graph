export const topics = [
  {
    id: "fundamentals",
    name: "Programming Fundamentals",
    description: "Core concepts required across software development",
  },
  {
    id: "frontend",
    name: "Frontend Development",
    description: "Skills used to build modern user interfaces",
  },
  {
    id: "backend",
    name: "Backend Development",
    description: "Server-side development and API engineering skills",
  },
  {
    id: "database",
    name: "Databases",
    description: "Relational, document and graph database concepts",
  },
];

export const skills = [
  {
    id: "programming-fundamentals",
    name: "Programming Fundamentals",
    description:
      "Variables, functions, control flow and basic programming concepts",
    topicId: "fundamentals",
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "Core JavaScript language concepts",
    topicId: "frontend",
  },
  {
    id: "async-javascript",
    name: "Async JavaScript",
    description: "Promises, async/await and asynchronous programming",
    topicId: "frontend",
  },
  {
    id: "react",
    name: "React",
    description: "Component-based frontend development with React",
    topicId: "frontend",
  },
  {
    id: "state-management",
    name: "State Management",
    description: "Managing application state in frontend applications",
    topicId: "frontend",
  },
  {
    id: "redux",
    name: "Redux",
    description: "Predictable global state management",
    topicId: "frontend",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "React framework for full-stack web applications",
    topicId: "frontend",
  },
  {
    id: "nodejs",
    name: "Node.js",
    description: "Server-side JavaScript runtime",
    topicId: "backend",
  },
  {
    id: "express",
    name: "Express.js",
    description: "Web framework for Node.js",
    topicId: "backend",
  },
  {
    id: "http",
    name: "HTTP",
    description:
      "HTTP methods, status codes, headers and request-response lifecycle",
    topicId: "backend",
  },
  {
    id: "rest-api",
    name: "REST APIs",
    description: "Designing RESTful web services",
    topicId: "backend",
  },
  {
    id: "authentication",
    name: "Authentication",
    description: "User authentication and authorization concepts",
    topicId: "backend",
  },
  {
    id: "jwt",
    name: "JWT",
    description: "Token-based authentication using JSON Web Tokens",
    topicId: "backend",
  },
  {
    id: "database-fundamentals",
    name: "Database Fundamentals",
    description: "Core concepts shared across database systems",
    topicId: "database",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "Document-oriented NoSQL database",
    topicId: "database",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Relational database management with PostgreSQL",
    topicId: "database",
  },
  {
    id: "graph-databases",
    name: "Graph Databases",
    description: "Graph-oriented data modelling and traversal",
    topicId: "database",
  },
  {
    id: "cypher",
    name: "Cypher",
    description: "Query language for property graph databases",
    topicId: "database",
  },
];

export const prerequisiteRelationships = [
  {
    from: "javascript",
    to: "programming-fundamentals",
  },
  {
    from: "async-javascript",
    to: "javascript",
  },
  {
    from: "react",
    to: "javascript",
  },
  {
    from: "state-management",
    to: "javascript",
  },
  {
    from: "redux",
    to: "state-management",
  },
  {
    from: "redux",
    to: "react",
  },
  {
    from: "nextjs",
    to: "react",
  },
  {
    from: "nodejs",
    to: "javascript",
  },
  {
    from: "express",
    to: "nodejs",
  },
  {
    from: "rest-api",
    to: "http",
  },
  {
    from: "authentication",
    to: "http",
  },
  {
    from: "jwt",
    to: "authentication",
  },
  {
    from: "mongodb",
    to: "database-fundamentals",
  },
  {
    from: "postgresql",
    to: "database-fundamentals",
  },
  {
    from: "graph-databases",
    to: "database-fundamentals",
  },
  {
    from: "cypher",
    to: "graph-databases",
  },
];

export const relatedSkillRelationships = [
  {
    from: "react",
    to: "async-javascript",
  },
  {
    from: "react",
    to: "state-management",
  },
  {
    from: "express",
    to: "rest-api",
  },
  {
    from: "express",
    to: "authentication",
  },
  {
    from: "jwt",
    to: "rest-api",
  },
  {
    from: "mongodb",
    to: "nodejs",
  },
  {
    from: "postgresql",
    to: "nodejs",
  },
];

export const questions = [
  {
    id: "q1",
    text: "Which JavaScript keyword creates a block-scoped variable that can be reassigned?",
    options: ["var", "let", "const", "static"],
    correctAnswer: "let",
    difficulty: "easy",
    skillId: "javascript",
  },
  {
    id: "q2",
    text: "Which syntax is commonly used to wait for a Promise inside an async function?",
    options: ["yield", "await", "defer", "resolve"],
    correctAnswer: "await",
    difficulty: "easy",
    skillId: "async-javascript",
  },
  {
    id: "q3",
    text: "Which React hook is primarily used for running side effects?",
    options: ["useState", "useEffect", "useMemo", "useRef"],
    correctAnswer: "useEffect",
    difficulty: "easy",
    skillId: "react",
  },
  {
    id: "q4",
    text: "Why should list items in React have a stable key?",
    options: [
      "To apply CSS",
      "To help React identify changed items",
      "To prevent API calls",
      "To create component state",
    ],
    correctAnswer: "To help React identify changed items",
    difficulty: "medium",
    skillId: "react",
  },
  {
    id: "q5",
    text: "What is a core principle of Redux reducers?",
    options: [
      "They should mutate global variables",
      "They should perform database queries",
      "They should be pure functions",
      "They should directly update the DOM",
    ],
    correctAnswer: "They should be pure functions",
    difficulty: "medium",
    skillId: "redux",
  },
  {
    id: "q6",
    text: "What allows Node.js to efficiently handle many I/O operations?",
    options: [
      "The event loop",
      "Multiple DOM trees",
      "CSS workers",
      "SQL triggers",
    ],
    correctAnswer: "The event loop",
    difficulty: "medium",
    skillId: "nodejs",
  },
  {
    id: "q7",
    text: "What is Express middleware commonly used for?",
    options: [
      "Processing requests before they reach route handlers",
      "Compiling React components",
      "Creating database tables",
      "Styling HTML pages",
    ],
    correctAnswer: "Processing requests before they reach route handlers",
    difficulty: "easy",
    skillId: "express",
  },
  {
    id: "q8",
    text: "Which HTTP status code commonly represents successful resource creation?",
    options: ["200", "201", "301", "404"],
    correctAnswer: "201",
    difficulty: "easy",
    skillId: "http",
  },
  {
    id: "q9",
    text: "Which HTTP method is normally used to retrieve a resource?",
    options: ["POST", "GET", "DELETE", "PATCH"],
    correctAnswer: "GET",
    difficulty: "easy",
    skillId: "rest-api",
  },
  {
    id: "q10",
    text: "What is the main purpose of a JWT signature?",
    options: [
      "Encrypt the entire payload",
      "Verify that the token has not been altered",
      "Store the token in MongoDB",
      "Hide the user's browser",
    ],
    correctAnswer: "Verify that the token has not been altered",
    difficulty: "medium",
    skillId: "jwt",
  },
  {
    id: "q11",
    text: "MongoDB primarily stores data in which form?",
    options: [
      "Graph edges only",
      "Documents",
      "Excel worksheets",
      "HTML elements",
    ],
    correctAnswer: "Documents",
    difficulty: "easy",
    skillId: "mongodb",
  },
  {
    id: "q12",
    text: "Which Cypher keyword is primarily used to find patterns in a graph?",
    options: ["MATCH", "SELECT", "FIND", "SEARCH"],
    correctAnswer: "MATCH",
    difficulty: "easy",
    skillId: "cypher",
  },
];
