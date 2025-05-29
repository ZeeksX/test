// export const SERVER_URL = "http://127.0.0.1:8000" // LOCAL SERVER URL
// export const SERVER_URL = "https://f37jnbjv-8000.uks1.devtunnels.ms" // REMOTE TUNNEL SERVER URL
// export const SERVER_URL = "https://192.168.115.199:8000/" // REMOTE TUNNEL SERVER URL
export const SERVER_URL = "https://backend-acad-ai.onrender.com"; // REMOTE DEV SERVER URL

export const PETTY_SERVER_URL = "https://petty-acadai-server.onrender.com"; // REMOTE DEV SERVER URL

export const sampleExamReviewData = {
  // Results object containing scores and details
  results: {
    student: {
      name: "Coleman Trevor",
      matricnumber: "20251019954", // Total score obtained by the user
    },
    total_scores: {
      1: 25, // Total score obtained by the user
    },
    max_possible_score: 50, // Maximum possible score for the exam
    details: {
      // Details for each question (indexed by question position)
      0: [
        null, // First element is typically null
        {
          score: 0, // Score obtained for this question
          feedback:
            "**Excellent work!** You correctly identified the key concepts.\n\nScore Breakdown:\nCriterion 1 - Understanding of basic concepts - 8.0/10.0\nCriterion 2 - Application of knowledge - 2.0/2.0",
        },
      ],
      1: [
        null,
        {
          score: 0,
          feedback:
            "Incorrect. The correct answer demonstrates better understanding of the topic. Please review the material on data structures.",
        },
      ],
      2: [
        null,
        {
          score: 25,
          feedback: {
            "Content Quality":
              "Your answer shows good understanding of the core concepts",
            "Technical Accuracy": "Most technical details are correct",
            Completeness: "Answer covers all required points",
            Clarity: "Well-structured and clear explanation",
          },
        },
      ],
    },
  },

  // Exam object containing questions and metadata
  exam: {
    id: 13,
    title: "Advanced Computer Science Examination",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        text: "Tunde was known for his honesty and diligence. One day, he found a lost wallet containing money and an ID card. Instead of keeping it, he took it to the village chief, who later returned it to the rightful owner—a wealthy merchant. Grateful for Tunde’s honesty, the merchant rewarded him with money and a scholarship.",
        score: 10,
        options: [
          {
            id: "opt1",
            text: "Encapsulation",
            isCorrect: false,
          },
          {
            id: "opt2",
            text: "Inheritance",
            isCorrect: false,
          },
          {
            id: "opt3",
            text: "Polymorphism",
            isCorrect: false,
          },
          {
            id: "opt4",
            text: "Compilation",
            isCorrect: true,
          },
        ],
      },
      {
        id: "q2",
        type: "cloze",
        text: "Fill in the blank: The time complexity of binary search is ____",
        score: 15,
        modelAnswer: "O(log n)",
      },
      {
        id: "q3",
        type: "theory",
        text: "Explain the difference between stack and queue data structures. Provide examples of real-world applications for each.",
        score: 25,
        modelAnswer:
          "**Stack vs Queue:**\n\n**Stack:**\n- LIFO (Last In, First Out) principle\n- Elements added and removed from the same end (top)\n- Operations: push(), pop(), peek()\n- Applications: Function call management, undo operations, expression evaluation\n\n**Queue:**\n- FIFO (First In, First Out) principle  \n- Elements added at rear, removed from front\n- Operations: enqueue(), dequeue(), front()\n- Applications: Process scheduling, breadth-first search, handling requests in web servers",
      },
    ],
  },

  // User's answers mapped by question ID
  userAnswers: {
    q1: "opt3", // Selected option ID for multiple choice
    q2: "Pellumi", // Text answer for cloze
    q3: "A stack follows LIFO principle where elements are added and removed from the top. Examples include browser back button, undo functionality. A queue follows FIFO principle where elements are added at rear and removed from front. Examples include print queues, process scheduling.", // Long text answer for theory
  },
};

export const sampleStudentResult = {
  student: {
    id: "STU001",
    last_name: "Johnson",
    other_names: "Michael David",
    matric_number: "CSC/2020/001",
  },
  totalScore: 85,
  exam: {
    id: "EX001",
    title: "Computer Science Fundamentals",
    duration: 120,
    questions: [
      {
        id: "Q001",
        type: "multiple_choice",
        text: "What is the time complexity of binary search?",
        options: [
          { id: "A", text: "O(n)" },
          { id: "B", text: "O(log n)" },
          { id: "C", text: "O(n²)" },
          { id: "D", text: "O(1)" },
        ],
        correctAnswer: "B",
        studentAnswer: "B",
        isCorrect: true,
        points: 5,
        explanation:
          "Binary search divides the search space in half with each iteration, resulting in logarithmic time complexity.",
      },
      {
        id: "Q002",
        type: "multiple_choice",
        text: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: [
          { id: "A", text: "Queue" },
          { id: "B", text: "Stack" },
          { id: "C", text: "Array" },
          { id: "D", text: "Linked List" },
        ],
        correctAnswer: "B",
        studentAnswer: "A",
        isCorrect: false,
        points: 0,
        explanation:
          "Stack follows LIFO principle where the last element added is the first to be removed.",
      },
      {
        id: "Q003",
        type: "true_false",
        text: "JavaScript is a statically typed language.",
        correctAnswer: false,
        studentAnswer: false,
        isCorrect: true,
        points: 3,
        explanation:
          "JavaScript is dynamically typed, meaning variable types are determined at runtime.",
      },
      {
        id: "Q004",
        type: "short_answer",
        text: "Explain the difference between == and === in JavaScript.",
        correctAnswer:
          "== performs type coercion while === performs strict comparison without type conversion",
        studentAnswer:
          "== compares values after converting types, === compares both value and type",
        isCorrect: true,
        points: 8,
        explanation:
          "The student correctly identified that == allows type coercion while === requires both value and type to match.",
      },
      {
        id: "Q005",
        type: "multiple_choice",
        text: "What does SQL stand for?",
        options: [
          { id: "A", text: "Structured Query Language" },
          { id: "B", text: "Simple Query Language" },
          { id: "C", text: "Standard Query Language" },
          { id: "D", text: "Sequential Query Language" },
        ],
        correctAnswer: "A",
        studentAnswer: "C",
        isCorrect: false,
        points: 0,
        explanation:
          "SQL stands for Structured Query Language, used for managing relational databases.",
      },
    ],
  },
  submittedAt: "2024-03-15T10:30:00Z",
  gradedAt: "2024-03-15T14:45:00Z",
  timeSpent: 95, // minutes
};

