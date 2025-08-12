// export const SERVER_URL = "http://127.0.0.1:8000" // LOCAL SERVER URL
// export const SERVER_URL = "https://f37jnbjv-8000.uks1.devtunnels.ms" // REMOTE TUNNEL SERVER URL
// export const SERVER_URL = "https://192.168.115.199:8000/" // REMOTE TUNNEL SERVER URL
export const SERVER_URL = "https://backend-acad-ai.onrender.com"; // REMOTE DEV SERVER URL

// export const PETTY_SERVER_URL = "http://localhost:3000"; // REMOTE LOCAL PETTY SERVER URL
export const PETTY_SERVER_URL = "https://petty-acadai-server.onrender.com"; // REMOTE DEV PETTY SERVER URL

export const CRITERIA_DATA = [
  {
    title: "Relevance to Question",
    description: "Provides a relevant point to every aspect of the question",
    lenientWeight: 0.4,
    strictWeight: 0.1,
    lenientDesc: "Focus on addressing all parts of the question",
    strictDesc: "Basic requirement with lower emphasis",
  },
  {
    title: "Structure & Correctness",
    description: "Quality of explanation and accuracy",
    lenientWeight: 0.3,
    strictWeight: 0.5,
    lenientDesc: "Well-structured, no incorrect/irrelevant points",
    strictDesc:
      "Well explained with correct terminology, no incorrect/vague/irrelevant points",
  },
  {
    title: "Answer Quality",
    description: "Depth and alignment with expected answers",
    lenientWeight: 0.3,
    strictWeight: 0.4,
    lenientDesc: "At least one key point related to corect answer/question",
    strictDesc:
      "Closely matches corect answer or contains two strong relevant points",
  },
];

export const CREDIT_PLANS = [
  {
    name: "Starter",
    description: "Perfect for new lecturers",
    price: "₦5,000",
    credits: "₦ 250 per credit",
    features: [
      "20 flexible credits",
      "Generate up to 100 questions",
      "Grade 20 exam questions",
      "Grade 40 cloze questions",
    ],
    amount: 20,
    cost: 5000,
  },
  {
    name: "Professional",
    description: "Standard choice for active lecturers",
    price: "₦11,250",
    credits: "₦ 225 per credit",
    badge: "Standard",
    features: [
      "50 flexible credits",
      "Generate up to 250 questions",
      "Grade 50 exam questions",
      "Grade 100 cloze questions",
    ],
    amount: 50,
    cost: 11250,
  },
  {
    name: "Power User",
    description: "For lectures with multiple courses",
    price: "₦20,000",
    credits: "₦ 200 per credit",
    badge: "Recommended",
    features: [
      "100 flexible credits",
      "Generate up to 500 questions",
      "Grade 100 exam questions",
      "Grade 200 cloze questions",
    ],
    amount: 100,
    cost: 20000,
  },
  {
    name: "Expert",
    description: "Maximum flexibility for heavy users",
    price: "₦37,500",
    credits: "₦ 150 per credit",
    features: [
      "250 flexible credits",
      "Generate up to 1,250 questions",
      "Grade 250 exam questions",
      "Grade 500 cloze questions",
    ],
    amount: 250,
    cost: 37500,
  },
];
