/**
 * SkillBridge - Default Demo Data Architecture
 * Realistic fictional demo data for students and fresh graduates.
 */

export const DEFAULT_CAREER_ROLES = [
  {
    id: "role-frontend",
    title: "Frontend Developer",
    category: "Web Engineering",
    description: "Build responsive, high-performance, accessible user interfaces using modern web standards, component frameworks, and state architecture.",
    averageStartingSalary: "$78,000 - $95,000",
    requiredSkills: [
      { name: "HTML5 & CSS3", category: "Web Development", minProficiency: "Advanced", weight: 20 },
      { name: "JavaScript", category: "Programming", minProficiency: "Advanced", weight: 25 },
      { name: "React", category: "Web Development", minProficiency: "Advanced", weight: 25 },
      { name: "TypeScript", category: "Programming", minProficiency: "Intermediate", weight: 15 },
      { name: "Git & GitHub", category: "Tools", minProficiency: "Intermediate", weight: 15 }
    ]
  },
  {
    id: "role-java",
    title: "Java Developer",
    category: "Backend Engineering",
    description: "Design and implement scalable enterprise microservices, REST APIs, and database transactions using Java and Spring Boot ecosystems.",
    averageStartingSalary: "$82,000 - $105,000",
    requiredSkills: [
      { name: "Java", category: "Programming", minProficiency: "Advanced", weight: 30 },
      { name: "Spring Boot", category: "Frameworks", minProficiency: "Intermediate", weight: 25 },
      { name: "SQL & PostgreSQL", category: "Database", minProficiency: "Advanced", weight: 20 },
      { name: "REST APIs", category: "Web Development", minProficiency: "Intermediate", weight: 15 },
      { name: "Git & GitHub", category: "Tools", minProficiency: "Intermediate", weight: 10 }
    ]
  },
  {
    id: "role-fullstack",
    title: "Full Stack Developer",
    category: "Software Engineering",
    description: "Deliver end-to-end features spanning responsive client frontends, secure backend REST APIs, relational schemas, and containerized deployments.",
    averageStartingSalary: "$85,000 - $110,000",
    requiredSkills: [
      { name: "JavaScript", category: "Programming", minProficiency: "Advanced", weight: 20 },
      { name: "React", category: "Web Development", minProficiency: "Intermediate", weight: 20 },
      { name: "Java", category: "Programming", minProficiency: "Intermediate", weight: 20 },
      { name: "SQL & PostgreSQL", category: "Database", minProficiency: "Intermediate", weight: 20 },
      { name: "Git & GitHub", category: "Tools", minProficiency: "Intermediate", weight: 10 },
      { name: "Docker", category: "Tools", minProficiency: "Beginner", weight: 10 }
    ]
  },
  {
    id: "role-data-analyst",
    title: "Data Analyst",
    category: "Data Science & BI",
    description: "Extract business insights, build dashboard visualizations, and query complex relational warehouses using SQL, Python, and statistical models.",
    averageStartingSalary: "$72,000 - $90,000",
    requiredSkills: [
      { name: "SQL & PostgreSQL", category: "Database", minProficiency: "Advanced", weight: 30 },
      { name: "Python", category: "Programming", minProficiency: "Intermediate", weight: 25 },
      { name: "Data Visualization", category: "Tools", minProficiency: "Intermediate", weight: 20 },
      { name: "Statistics", category: "Mathematics", minProficiency: "Intermediate", weight: 15 },
      { name: "Technical Documentation", category: "Communication", minProficiency: "Intermediate", weight: 10 }
    ]
  },
  {
    id: "role-testing",
    title: "Software Testing Engineer",
    category: "Quality Engineering",
    description: "Engineer automated end-to-end integration test suites, maintain CI regression tests, and execute manual verification protocols.",
    averageStartingSalary: "$70,000 - $88,000",
    requiredSkills: [
      { name: "Java", category: "Programming", minProficiency: "Intermediate", weight: 25 },
      { name: "Test Automation (Selenium)", category: "Tools", minProficiency: "Intermediate", weight: 30 },
      { name: "SQL & PostgreSQL", category: "Database", minProficiency: "Intermediate", weight: 20 },
      { name: "Git & GitHub", category: "Tools", minProficiency: "Intermediate", weight: 15 },
      { name: "Technical Documentation", category: "Communication", minProficiency: "Advanced", weight: 10 }
    ]
  }
];

export const DEFAULT_USER_PROFILE = {
  id: "user-101",
  name: "Alex Rivera",
  email: "alex.rivera@university.edu",
  headline: "Computer Science Senior & Aspiring Full Stack Engineer",
  education: "B.S. in Computer Science, State University (Graduating 2026)",
  targetRoleId: "role-fullstack",
  bio: "Passionate CS senior specializing in modern web architecture, distributed systems, and relational databases. Seeking Summer 2026 Full Stack or Java software engineering internships.",
  githubUrl: "https://github.com/alexrivera-dev",
  linkedinUrl: "https://linkedin.com/in/alexrivera-dev",
  portfolioSlug: "alexrivera",
  joinedDate: "2025-09-01T08:00:00Z"
};

export const DEFAULT_SKILLS = [
  {
    id: "sk-1",
    name: "Java",
    category: "Programming",
    proficiency: "Intermediate", // Beginner: 35%, Intermediate: 70%, Advanced: 100%
    numericScore: 75,
    status: "Active Learning",
    notes: "Core coursework completed. Building Spring Boot backend services."
  },
  {
    id: "sk-2",
    name: "JavaScript",
    category: "Programming",
    proficiency: "Advanced",
    numericScore: 90,
    status: "Mastered",
    notes: "ES6+, async/await, closures, functional patterns, browser DOM."
  },
  {
    id: "sk-3",
    name: "React",
    category: "Web Development",
    proficiency: "Intermediate",
    numericScore: 70,
    status: "Active Learning",
    notes: "Hooks, custom hooks, context API, state management, SPA routing."
  },
  {
    id: "sk-4",
    name: "HTML5 & CSS3",
    category: "Web Development",
    proficiency: "Advanced",
    numericScore: 95,
    status: "Mastered",
    notes: "Semantic HTML, Flexbox, Grid, CSS custom properties, responsive design."
  },
  {
    id: "sk-5",
    name: "SQL & PostgreSQL",
    category: "Database",
    proficiency: "Intermediate",
    numericScore: 75,
    status: "Active Learning",
    notes: "Complex joins, indexing, group by, constraints, schema design."
  },
  {
    id: "sk-6",
    name: "Git & GitHub",
    category: "Tools",
    proficiency: "Advanced",
    numericScore: 85,
    status: "Mastered",
    notes: "Branching, rebase, merge conflicts, pull requests, conventional commits."
  },
  {
    id: "sk-7",
    name: "Python",
    category: "Programming",
    proficiency: "Beginner",
    numericScore: 40,
    status: "Active Learning",
    notes: "Data structures, scripting, basic data manipulation with Pandas."
  },
  {
    id: "sk-8",
    name: "Technical Documentation",
    category: "Communication",
    proficiency: "Advanced",
    numericScore: 85,
    status: "Mastered",
    notes: "Clear API docs, architecture specs, markdown guides, peer code reviews."
  },
  {
    id: "sk-9",
    name: "Docker",
    category: "Tools",
    proficiency: "Beginner",
    numericScore: 35,
    status: "Planned",
    notes: "Dockerfiles, containerization, basic multi-container compose setups."
  }
];

export const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "CampusConnect Peer Tutoring Portal",
    description: "A collaborative web platform connecting university students with department-certified peer tutors. Features live scheduling, course matching, and session reviews.",
    category: "Full Stack",
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    githubUrl: "https://github.com/alexrivera-dev/campus-connect",
    liveUrl: "https://campusconnect-demo.example.edu",
    thumbnailUrl: "",
    status: "Completed",
    date: "2025-11-15",
    featured: true
  },
  {
    id: "proj-2",
    title: "Spring Boot Microservice Task Manager",
    description: "A production-grade REST API backend built in Java for distributed task management, implementing JWT authentication, role-based security, and JPA repositories.",
    category: "Backend",
    technologies: ["Java", "Spring Boot", "MySQL", "JWT", "Maven"],
    githubUrl: "https://github.com/alexrivera-dev/spring-task-microservice",
    liveUrl: "https://api-taskmanager.example.com/swagger-ui",
    thumbnailUrl: "",
    status: "Completed",
    date: "2025-12-20",
    featured: true
  },
  {
    id: "proj-3",
    title: "Algorithmic Market Backtester",
    description: "A Python simulation tool evaluating technical trading indicators across 5 years of historical equity data, generating Sharpe ratios and drawdown plots.",
    category: "Data & Systems",
    technologies: ["Python", "Pandas", "Matplotlib", "NumPy"],
    githubUrl: "https://github.com/alexrivera-dev/algo-market-backtester",
    liveUrl: "",
    thumbnailUrl: "",
    status: "Completed",
    date: "2026-01-10",
    featured: false
  },
  {
    id: "proj-4",
    title: "Zero-Knowledge Client-Side Vault",
    description: "A secure browser-based document encrypter utilizing WebCrypto SubtleCrypto APIs and AES-GCM 256 encryption. Plaintext never leaves the local machine.",
    category: "Security & Web",
    technologies: ["JavaScript", "WebCrypto API", "HTML5", "CSS3"],
    githubUrl: "https://github.com/alexrivera-dev/zk-crypto-vault",
    liveUrl: "https://zk-vault.example.com",
    thumbnailUrl: "",
    status: "In Progress",
    date: "2026-02-01",
    featured: true
  },
  {
    id: "proj-5",
    title: "Distributed InMemory Key-Value Store",
    description: "A concurrent Java storage engine inspired by Redis, featuring LRU eviction policies, multi-threaded socket server, and replication synchronization.",
    category: "Systems",
    technologies: ["Java", "Concurrency", "Sockets", "Unit Testing"],
    githubUrl: "https://github.com/alexrivera-dev/java-keyvalue-engine",
    liveUrl: "",
    thumbnailUrl: "",
    status: "In Progress",
    date: "2026-02-28",
    featured: false
  },
  {
    id: "proj-6",
    title: "Automated Selenium Regression Suite",
    description: "An automated end-to-end testing framework using Page Object Model (POM) pattern to validate cross-browser flows on college departmental portals.",
    category: "Testing",
    technologies: ["Java", "Selenium WebDriver", "JUnit 5", "Maven"],
    githubUrl: "https://github.com/alexrivera-dev/selenium-pom-suite",
    liveUrl: "",
    thumbnailUrl: "",
    status: "Planned",
    date: "2026-03-15",
    featured: false
  }
];

export const DEFAULT_QUIZ_QUESTIONS = [
  // HTML (6 questions)
  {
    id: "q-html-1",
    category: "HTML",
    difficulty: "Easy",
    question: "Which HTML5 semantic element is most appropriate for self-contained, syndicatable content such as a blog post or news item?",
    options: ["<section>", "<article>", "<aside>", "<div>"],
    correctIndex: 1,
    explanation: "<article> is specifically designed for independent, self-contained content that makes sense on its own outside of the page context."
  },
  {
    id: "q-html-2",
    category: "HTML",
    difficulty: "Medium",
    question: "What does the 'defer' attribute on a <script> element do in standard HTML5?",
    options: [
      "Executes the script immediately, pausing HTML parsing",
      "Downloads the script asynchronously and executes it as soon as download completes",
      "Downloads the script in parallel with parsing and executes it in order after HTML parsing completes",
      "Prevents the script from executing until the user interacts with the page"
    ],
    correctIndex: 2,
    explanation: "'defer' downloads the script in parallel without blocking parsing, and executes scripts in document order once DOM parsing is complete."
  },
  {
    id: "q-html-3",
    category: "HTML",
    difficulty: "Easy",
    question: "Which attribute is required on an <img> element to ensure accessibility for screen readers?",
    options: ["title", "alt", "aria-label", "role"],
    correctIndex: 1,
    explanation: "The 'alt' attribute provides alternative text for screen readers and acts as a fallback when images fail to render."
  },
  {
    id: "q-html-4",
    category: "HTML",
    difficulty: "Medium",
    question: "Which meta tag viewport setting is standard for building mobile-responsive layouts?",
    options: [
      "<meta name='viewport' content='width=1024'>",
      "<meta name='viewport' content='width=device-width, initial-scale=1.0'>",
      "<meta name='viewport' content='user-scalable=no'>",
      "<meta name='viewport' content='maximum-scale=2.0'>"
    ],
    correctIndex: 1,
    explanation: "width=device-width, initial-scale=1.0 instructs the mobile browser to render the page at the device's native screen width with standard 100% zoom."
  },
  {
    id: "q-html-5",
    category: "HTML",
    difficulty: "Hard",
    question: "In HTML5 forms, what happens when an input with type='email' fails browser constraint validation on submission?",
    options: [
      "An HTTP 400 Bad Request is sent automatically",
      "The form fires an 'invalid' event on the input and blocks submission",
      "The browser clears the invalid input field",
      "The submit button is automatically disabled"
    ],
    correctIndex: 1,
    explanation: "The browser's native constraint validation stops submission and dispatches a cancelable 'invalid' event to the element."
  },
  {
    id: "q-html-6",
    category: "HTML",
    difficulty: "Easy",
    question: "Which element represents the main content of the <body> of a document or application?",
    options: ["<content>", "<main>", "<section>", "<header>"],
    correctIndex: 1,
    explanation: "The <main> element specifies the main, non-repeated content unique to the document."
  },

  // CSS (6 questions)
  {
    id: "q-css-1",
    category: "CSS",
    difficulty: "Easy",
    question: "What is the primary difference between CSS Grid and Flexbox?",
    options: [
      "Grid is one-dimensional while Flexbox is two-dimensional",
      "Flexbox is one-dimensional (row OR column), while Grid is two-dimensional (rows AND columns simultaneously)",
      "Flexbox cannot align items vertically",
      "Grid is deprecated in CSS3 in favor of subgrid"
    ],
    correctIndex: 1,
    explanation: "Flexbox manages layout along a single axis at a time, whereas Grid orchestrates elements along both rows and columns simultaneously."
  },
  {
    id: "q-css-2",
    category: "CSS",
    difficulty: "Medium",
    question: "Which CSS selector has the highest specificity?",
    options: [
      "div.card p",
      "#navigation .nav-item",
      "header nav ul li a:hover",
      "* [data-active]"
    ],
    correctIndex: 1,
    explanation: "#navigation .nav-item contains 1 ID (1,0,0) and 1 class (0,1,0) = 0,1,1,0 specificity, which outweighs selectors with zero IDs."
  },
  {
    id: "q-css-3",
    category: "CSS",
    difficulty: "Medium",
    question: "What does 'box-sizing: border-box' change about the standard box model?",
    options: [
      "Padding and border are included within the element's specified width and height",
      "Margin is included inside width and height",
      "It disables borders on flex children",
      "It forces the element to display as an inline-block"
    ],
    correctIndex: 0,
    explanation: "With border-box, width = content + padding + border, preventing elements from expanding unexpectedly when padding is added."
  },
  {
    id: "q-css-4",
    category: "CSS",
    difficulty: "Hard",
    question: "Which CSS property performance-wise triggers only compositor operations, avoiding layout reflow and paint?",
    options: [
      "height",
      "top",
      "transform",
      "margin-left"
    ],
    correctIndex: 2,
    explanation: "'transform' and 'opacity' are handled entirely on the GPU compositor thread, making them ideal for high-performance animations."
  },
  {
    id: "q-css-5",
    category: "CSS",
    difficulty: "Easy",
    question: "What CSS function is used to define custom variables (custom properties)?",
    options: ["var(--custom-name)", "calc(100% - 20px)", "attr(data-color)", "env(safe-area)"],
    correctIndex: 0,
    explanation: "CSS custom properties are referenced using the var(--variable-name) function."
  },
  {
    id: "q-css-6",
    category: "CSS",
    difficulty: "Medium",
    question: "In CSS Flexbox, what does 'justify-content: space-between' do?",
    options: [
      "Centers all items along the cross axis",
      "Distributes items evenly along the main axis with first item at start and last at end",
      "Adds identical margin to every child item",
      "Wraps flex items onto multiple lines"
    ],
    correctIndex: 1,
    explanation: "'space-between' places the first item flush against the start edge, the last item against the end edge, and spaces remaining items equally."
  },

  // JavaScript (8 questions)
  {
    id: "q-js-1",
    category: "JavaScript",
    difficulty: "Easy",
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: [
      "'==' checks both value and type, while '===' only checks value",
      "'===' performs strict equality without type coercion; '==' allows type coercion",
      "'===' is only for comparing objects, while '==' is for primitives",
      "There is no difference; '===' is legacy syntax"
    ],
    correctIndex: 1,
    explanation: "'===' checks both value and type strictly without converting either operand, whereas '==' coerces types before comparison."
  },
  {
    id: "q-js-2",
    category: "JavaScript",
    difficulty: "Medium",
    question: "What is a closure in JavaScript?",
    options: [
      "A function that terminates the execution loop",
      "The combination of a function bundled together with references to its surrounding lexical environment",
      "An anonymous arrow function with no parameters",
      "A method that closes a database or file stream"
    ],
    correctIndex: 1,
    explanation: "A closure gives an inner function access to its outer function's scope even after the outer function has returned."
  },
  {
    id: "q-js-3",
    category: "JavaScript",
    difficulty: "Medium",
    question: "What will `console.log(typeof NaN)` output in standard JavaScript?",
    options: ["'undefined'", "'nan'", "'number'", "'object'"],
    correctIndex: 2,
    explanation: "In JavaScript, NaN (Not-a-Number) is a special numeric value specified by IEEE 754 floating-point, so its typeof is 'number'."
  },
  {
    id: "q-js-4",
    category: "JavaScript",
    difficulty: "Hard",
    question: "In the JavaScript event loop, what executes first after the currently running synchronous code completes?",
    options: [
      "Macrotasks (e.g., setTimeout, setInterval)",
      "Microtasks (e.g., Promise.then, queueMicrotask)",
      "RequestAnimationFrame callbacks",
      "UI rendering cycle"
    ],
    correctIndex: 1,
    explanation: "All jobs in the Microtask queue (Promises, queueMicrotask) are drained completely before moving to the next Macrotask."
  },
  {
    id: "q-js-5",
    category: "JavaScript",
    difficulty: "Easy",
    question: "Which Array method returns a new array with all elements that pass the test implemented by the provided callback function?",
    options: ["forEach()", "map()", "filter()", "reduce()"],
    correctIndex: 2,
    explanation: "Array.prototype.filter() creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the test."
  },
  {
    id: "q-js-6",
    category: "JavaScript",
    difficulty: "Medium",
    question: "How does `const` declare variables in JavaScript?",
    options: [
      "It creates an immutable value that can never be modified under any circumstances",
      "It creates a block-scoped variable whose identifier reference cannot be reassigned",
      "It declares a globally hoisted constant variable",
      "It makes object properties deeply frozen"
    ],
    correctIndex: 1,
    explanation: "const creates a block-scoped binding that cannot be reassigned, but if the value is an object or array, its internal properties remain mutable."
  },
  {
    id: "q-js-7",
    category: "JavaScript",
    difficulty: "Hard",
    question: "What does `Promise.all([p1, p2, p3])` do if `p2` rejects?",
    options: [
      "Waits for p1 and p3 to finish, then returns all settled results",
      "Immediately rejects with the reason of the first promise that rejected (fail-fast)",
      "Ignores p2 and resolves with [p1, p3]",
      "Throws an unhandled TypeError"
    ],
    correctIndex: 1,
    explanation: "Promise.all rejects immediately upon the first rejection among the input promises (fail-fast behavior)."
  },
  {
    id: "q-js-8",
    category: "JavaScript",
    difficulty: "Easy",
    question: "What is the JSON method used to convert a JavaScript object into a JSON string?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.serialize()", "JSON.encode()"],
    correctIndex: 1,
    explanation: "JSON.stringify() converts a JavaScript value to a JSON string representation."
  },

  // SQL (6 questions)
  {
    id: "q-sql-1",
    category: "SQL",
    difficulty: "Easy",
    question: "Which SQL clause is used to filter records returned by an aggregate function like COUNT() or AVG()?",
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    correctIndex: 1,
    explanation: "HAVING filters groups created by GROUP BY or aggregated results, while WHERE filters individual rows before aggregation occurs."
  },
  {
    id: "q-sql-2",
    category: "SQL",
    difficulty: "Medium",
    question: "What is the result of an INNER JOIN between Table A and Table B?",
    options: [
      "All rows from Table A, plus matching rows from Table B",
      "All rows from Table B, plus matching rows from Table A",
      "Only the rows that have matching values in both tables",
      "A Cartesian product of all rows from both tables"
    ],
    correctIndex: 2,
    explanation: "INNER JOIN selects records that have matching values in both joined tables."
  },
  {
    id: "q-sql-3",
    category: "SQL",
    difficulty: "Medium",
    question: "What is a database INDEX primarily used for?",
    options: [
      "Encrypting sensitive column values at rest",
      "Accelerating data retrieval performance on queries at the cost of slower writes and additional storage",
      "Enforcing primary key uniqueness automatically",
      "Creating backup snapshots of tables"
    ],
    correctIndex: 1,
    explanation: "An index creates an optimized lookup structure (such as B-tree) allowing the query engine to find rows quickly without full table scans."
  },
  {
    id: "q-sql-4",
    category: "SQL",
    difficulty: "Hard",
    question: "In relational database ACID properties, what does 'Isolation' guarantee?",
    options: [
      "Data changes are written permanently to disk even during power failure",
      "Concurrent transactions execute without interfering with one another's intermediate states",
      "All statements in a transaction either complete or all roll back",
      "Foreign key constraints are enforced continuously"
    ],
    correctIndex: 1,
    explanation: "Isolation ensures that concurrent execution of transactions leaves the database in the same state that would have been obtained if transactions were executed sequentially."
  },
  {
    id: "q-sql-5",
    category: "SQL",
    difficulty: "Easy",
    question: "Which SQL statement is used to remove a table and all its structure permanently from the database?",
    options: ["DELETE TABLE users;", "DROP TABLE users;", "TRUNCATE TABLE users;", "REMOVE TABLE users;"],
    correctIndex: 1,
    explanation: "DROP TABLE deletes the table definition along with all its data, indexes, and triggers permanently."
  },
  {
    id: "q-sql-6",
    category: "SQL",
    difficulty: "Medium",
    question: "What is the primary key constraint in relational databases?",
    options: [
      "A column that must allow NULL values",
      "A column or set of columns that uniquely identifies each row in a table and cannot contain NULL values",
      "A link connecting a child row to an external table",
      "A temporary key assigned during active sessions"
    ],
    correctIndex: 1,
    explanation: "A Primary Key uniquely identifies each record and enforces both UNIQUE and NOT NULL constraints."
  },

  // General Programming & CS Foundations (6 questions)
  {
    id: "q-cs-1",
    category: "General Programming",
    difficulty: "Easy",
    question: "What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST) with N nodes?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctIndex: 1,
    explanation: "In a balanced BST, each comparison halves the search space, giving an average time complexity of O(log N)."
  },
  {
    id: "q-cs-2",
    category: "General Programming",
    difficulty: "Medium",
    question: "Which Object-Oriented Programming (OOP) principle is defined as bundling data and methods that operate on that data into a single unit and restricting direct access to some of an object's components?",
    options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
    correctIndex: 2,
    explanation: "Encapsulation keeps properties and operations together while hiding internal implementation details behind private scopes and accessors."
  },
  {
    id: "q-cs-3",
    category: "General Programming",
    difficulty: "Medium",
    question: "In RESTful API design, which HTTP method is considered both idempotent and safe?",
    options: ["POST", "PUT", "GET", "PATCH"],
    correctIndex: 2,
    explanation: "GET is both safe (does not alter server state) and idempotent (multiple identical requests produce the same result)."
  },
  {
    id: "q-cs-4",
    category: "General Programming",
    difficulty: "Hard",
    question: "What is the time and space complexity of QuickSort in the worst-case scenario (e.g., poorly chosen pivots on sorted input)?",
    options: [
      "Time: O(N log N), Space: O(1)",
      "Time: O(N^2), Space: O(N) recursion stack",
      "Time: O(N), Space: O(log N)",
      "Time: O(N^2), Space: O(1)"
    ],
    correctIndex: 1,
    explanation: "If the pivot splits the array into 0 and N-1 elements at every step, QuickSort degrades to O(N^2) time and requires O(N) stack frames."
  },
  {
    id: "q-cs-5",
    category: "General Programming",
    difficulty: "Easy",
    question: "Which data structure operates on a Last-In, First-Out (LIFO) order?",
    options: ["Queue", "Stack", "Linked List", "Priority Queue"],
    correctIndex: 1,
    explanation: "A Stack processes the most recently pushed element first (LIFO order)."
  },
  {
    id: "q-cs-6",
    category: "General Programming",
    difficulty: "Medium",
    question: "In Git version control, what does `git merge --no-ff` ensure?",
    options: [
      "It deletes the feature branch after merging",
      "It creates a dedicated merge commit even if the merge could be resolved as a fast-forward",
      "It suppresses merge conflict warnings",
      "It automatically rebases commits onto the remote HEAD"
    ],
    correctIndex: 1,
    explanation: "--no-ff prevents fast-forwarding, preserving the historical existence and boundary of the feature branch in the commit graph."
  }
];

export const DEFAULT_QUIZ_ATTEMPTS = [
  {
    id: "attempt-1",
    quizTitle: "Full Stack Diagnostic Assessment",
    date: "2026-03-01T14:30:00Z",
    totalQuestions: 15,
    correctAnswers: 12,
    scorePercentage: 80,
    timeTakenSeconds: 540,
    categoryScores: {
      HTML: { correct: 3, total: 3 },
      CSS: { correct: 2, total: 3 },
      JavaScript: { correct: 4, total: 5 },
      SQL: { correct: 3, total: 4 }
    }
  },
  {
    id: "attempt-2",
    quizTitle: "JavaScript & Algorithms Benchmark",
    date: "2026-03-08T16:15:00Z",
    totalQuestions: 10,
    correctAnswers: 9,
    scorePercentage: 90,
    timeTakenSeconds: 380,
    categoryScores: {
      JavaScript: { correct: 5, total: 5 },
      "General Programming": { correct: 4, total: 5 }
    }
  }
];

export const DEFAULT_INTERNSHIPS = [
  {
    id: "int-1",
    company: "NextGen Cloud Systems",
    role: "Full Stack Engineering Intern (Summer 2026)",
    location: "Austin, TX",
    workMode: "Hybrid",
    category: "Full Stack",
    stipend: "$42 - $48 / hour",
    requiredSkills: ["JavaScript", "React", "Node.js", "SQL"],
    description: "Join our cloud management portal engineering squad. You will build user-facing analytics dashboards and implement performant REST endpoints supporting 2M daily operations.",
    deadline: "2026-05-15",
    applicationUrl: "https://example.com/careers/nextgen-cloud-intern",
    status: "Interview", // Saved, Applied, Interview, Offered, Rejected
    appliedDate: "2026-02-14",
    isBookmarked: true,
    isSampleDemo: true
  },
  {
    id: "int-2",
    company: "Apex Fintech Labs",
    role: "Java Backend Software Intern",
    location: "New York, NY",
    workMode: "On-site",
    category: "Backend",
    stipend: "$45 - $52 / hour",
    requiredSkills: ["Java", "Spring Boot", "SQL & PostgreSQL", "Git & GitHub"],
    description: "Contribute to real-time clearing microservices. Work directly alongside staff engineers to optimize database indexing and write resilient transactional test suites.",
    deadline: "2026-04-30",
    applicationUrl: "https://example.com/careers/apex-java-intern",
    status: "Applied",
    appliedDate: "2026-02-20",
    isBookmarked: true,
    isSampleDemo: true
  },
  {
    id: "int-3",
    company: "Vertex HealthTech",
    role: "Frontend Web Developer Intern",
    location: "San Francisco, CA",
    workMode: "Remote",
    category: "Frontend",
    stipend: "$38 - $44 / hour",
    requiredSkills: ["HTML5 & CSS3", "JavaScript", "React", "TypeScript"],
    description: "Design accessible, responsive patient monitoring interfaces using modern React component libraries and WebSockets for real-time vitals updates.",
    deadline: "2026-05-30",
    applicationUrl: "https://example.com/careers/vertex-frontend-intern",
    status: "Saved",
    appliedDate: null,
    isBookmarked: true,
    isSampleDemo: true
  },
  {
    id: "int-4",
    company: "CloudScale Networks",
    role: "Cloud Infrastructure & DevOps Intern",
    location: "Seattle, WA",
    workMode: "Hybrid",
    category: "DevOps & Cloud",
    stipend: "$40 - $46 / hour",
    requiredSkills: ["Docker", "Linux", "Python", "Git & GitHub"],
    description: "Automate CI/CD pipelines, containerize backend microservices, and deploy health probes across multi-region Kubernetes clusters.",
    deadline: "2026-06-01",
    applicationUrl: "https://example.com/careers/cloudscale-intern",
    status: "Offered",
    appliedDate: "2026-01-15",
    isBookmarked: false,
    isSampleDemo: true
  },
  {
    id: "int-5",
    company: "Horizon Robotics",
    role: "Junior Software Testing & QA Intern",
    location: "Boston, MA",
    workMode: "On-site",
    category: "QA & Testing",
    stipend: "$35 - $40 / hour",
    requiredSkills: ["Java", "Selenium", "SQL", "Technical Documentation"],
    description: "Maintain test automation frameworks for autonomous navigation controllers. Author test plans, bug reproduction logs, and regression runs.",
    deadline: "2026-05-20",
    applicationUrl: "https://example.com/careers/horizon-qa-intern",
    status: "Saved",
    appliedDate: null,
    isBookmarked: false,
    isSampleDemo: true
  },
  {
    id: "int-6",
    company: "DataPulse Analytics",
    role: "Data Engineering & Analytics Intern",
    location: "Chicago, IL",
    workMode: "Remote",
    category: "Data",
    stipend: "$36 - $42 / hour",
    requiredSkills: ["SQL & PostgreSQL", "Python", "Data Visualization"],
    description: "Transform raw behavioral telemetry into structured warehouse schemas. Build executive reporting charts and optimize warehouse partition queries.",
    deadline: "2026-05-10",
    applicationUrl: "https://example.com/careers/datapulse-intern",
    status: "Rejected",
    appliedDate: "2026-01-10",
    isBookmarked: false,
    isSampleDemo: true
  },
  {
    id: "int-7",
    company: "AgileByte Software",
    role: "Software Development Intern",
    location: "Denver, CO",
    workMode: "Remote",
    category: "Full Stack",
    stipend: "$34 - $38 / hour",
    requiredSkills: ["JavaScript", "HTML5 & CSS3", "React", "REST APIs"],
    description: "Collaborate in an Agile squad delivering customer feedback tools. Write clean unit tests and participate in bi-weekly sprint planning.",
    deadline: "2026-06-15",
    applicationUrl: "https://example.com/careers/agilebyte-intern",
    status: "Saved",
    appliedDate: null,
    isBookmarked: true,
    isSampleDemo: true
  },
  {
    id: "int-8",
    company: "CyberShield Security",
    role: "Application Security Analyst Intern",
    location: "Washington, DC",
    workMode: "Hybrid",
    category: "Security",
    stipend: "$40 - $47 / hour",
    requiredSkills: ["Java", "Python", "Web Security", "Git & GitHub"],
    description: "Assist application security leads with static code analysis (SAST), vulnerability triage (OWASP Top 10), and automated dependency audits.",
    deadline: "2026-05-25",
    applicationUrl: "https://example.com/careers/cybershield-intern",
    status: "Applied",
    appliedDate: "2026-02-25",
    isBookmarked: false,
    isSampleDemo: true
  },
  {
    id: "int-9",
    company: "Blueprint Media Labs",
    role: "Web UI/UX Developer Intern",
    location: "Los Angeles, CA",
    workMode: "Remote",
    category: "Frontend",
    stipend: "$32 - $36 / hour",
    requiredSkills: ["HTML5 & CSS3", "JavaScript", "React", "Figma"],
    description: "Turn high-fidelity Figma components into pixel-perfect responsive web pages with smooth CSS transitions and strict accessibility conformance.",
    deadline: "2026-06-30",
    applicationUrl: "https://example.com/careers/blueprint-intern",
    status: "Saved",
    appliedDate: null,
    isBookmarked: false,
    isSampleDemo: true
  },
  {
    id: "int-10",
    company: "Lumina Interactive",
    role: "Core Systems Software Intern",
    location: "Austin, TX",
    workMode: "Hybrid",
    category: "Systems",
    stipend: "$44 - $50 / hour",
    requiredSkills: ["Java", "Data Structures", "Algorithms", "Concurrency"],
    description: "Work on low-latency asset synchronization networks and high-throughput thread pooling engines for interactive real-time applications.",
    deadline: "2026-05-18",
    applicationUrl: "https://example.com/careers/lumina-intern",
    status: "Saved",
    appliedDate: null,
    isBookmarked: false,
    isSampleDemo: true
  }
];

export const DEFAULT_ROADMAP_TASKS = [
  {
    id: "task-1",
    title: "Master Spring Boot Data JPA & Query Methods",
    description: "Complete hands-on exercise creating custom repository queries and eager/lazy fetching associations in Java.",
    relatedSkill: "Java",
    priority: "High", // High, Medium, Low
    dueDate: "2026-03-20",
    estimatedHours: 12,
    completed: true,
    completedDate: "2026-03-12"
  },
  {
    id: "task-2",
    title: "Implement PostgreSQL B-Tree Index Optimization",
    description: "Analyze slow query plans with EXPLAIN ANALYZE on a 100k row test database and create composite indexes.",
    relatedSkill: "SQL & PostgreSQL",
    priority: "High",
    dueDate: "2026-03-25",
    estimatedHours: 8,
    completed: true,
    completedDate: "2026-03-14"
  },
  {
    id: "task-3",
    title: "Build Docker Multi-Stage Build for React & Java",
    description: "Containerize the CampusConnect web application with minimal image footprints using Alpine bases.",
    relatedSkill: "Docker",
    priority: "High",
    dueDate: "2026-03-30",
    estimatedHours: 10,
    completed: false,
    completedDate: null
  },
  {
    id: "task-4",
    title: "Complete 20 Advanced LeetCode SQL & Tree Problems",
    description: "Practice sliding windows, binary tree traversals, and window aggregate functions (ROW_NUMBER, RANK).",
    relatedSkill: "Programming",
    priority: "Medium",
    dueDate: "2026-04-05",
    estimatedHours: 15,
    completed: false,
    completedDate: null
  },
  {
    id: "task-5",
    title: "Implement React 19 Action Hooks & Optimistic UI",
    description: "Refactor form submission states to use useOptimistic and form actions in personal portfolio projects.",
    relatedSkill: "React",
    priority: "Medium",
    dueDate: "2026-04-12",
    estimatedHours: 6,
    completed: false,
    completedDate: null
  },
  {
    id: "task-6",
    title: "Draft Technical Design Document for In-Memory Cache",
    description: "Document eviction architecture, mutex locking schemes, and benchmarking methodology in Markdown.",
    relatedSkill: "Technical Documentation",
    priority: "Low",
    dueDate: "2026-04-18",
    estimatedHours: 5,
    completed: false,
    completedDate: null
  },
  {
    id: "task-7",
    title: "Setup CI GitHub Actions Automated Test Runner",
    description: "Configure workflow YAML to run Maven test and ESLint on every push to main branch.",
    relatedSkill: "Git & GitHub",
    priority: "Medium",
    dueDate: "2026-04-25",
    estimatedHours: 4,
    completed: false,
    completedDate: null
  },
  {
    id: "task-8",
    title: "Conduct Mock Technical Screen with Peer Tutor",
    description: "Complete a 45-minute live coding simulation covering system architecture and data structures.",
    relatedSkill: "Communication",
    priority: "High",
    dueDate: "2026-05-02",
    estimatedHours: 3,
    completed: false,
    completedDate: null
  }
];

export const DEFAULT_ACTIVITY_FEED = [
  {
    id: "act-1",
    action: "Completed Roadmap Task",
    text: "Finished 'Implement PostgreSQL B-Tree Index Optimization'",
    time: "Yesterday at 4:15 PM",
    icon: "check-circle"
  },
  {
    id: "act-2",
    action: "Quiz Assessment",
    text: "Scored 90% on JavaScript & Algorithms Benchmark",
    time: "3 days ago",
    icon: "award"
  },
  {
    id: "act-3",
    action: "Internship Status Updated",
    text: "NextGen Cloud Systems moved to 'Interview' stage",
    time: "5 days ago",
    icon: "briefcase"
  },
  {
    id: "act-4",
    action: "Project Updated",
    text: "Added WebCrypto subtle encryption details to 'Zero-Knowledge Vault'",
    time: "1 week ago",
    icon: "folder"
  },
  {
    id: "act-5",
    action: "Skill Logged",
    text: "Promoted 'Git & GitHub' proficiency to Advanced",
    time: "2 weeks ago",
    icon: "trending-up"
  }
];
