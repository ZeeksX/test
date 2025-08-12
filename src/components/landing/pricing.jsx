import InfoCard from "../ui/CreditCard";
import PricingCard from "../ui/PricingCard";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const infoCards = [
  {
    icon: "/question-icon.svg",
    header: "Generate Questions",
    description: "Create 5 AI-powered questions",
  },
  {
    icon: "/grade-icon.svg",
    header: "Grade Theory",
    description: "Grade 1 theory question for a student group",
  },
  {
    icon: "/clone-icon.svg",
    header: "Grade Cloze",
    description: "Grade 2 cloze questions for a student group",
  },
];

const pricingPlans = [
  {
    header: "Starter",
    description: "Perfect for new lecturers",
    price: "5,000",
    pricePerCredit: "250",
    features: [
      "20 flexible credits",
      "Generate up to 100 questions",
      "Grade 20 exam questions",
      "Grade 40 cloze questions",
    ],
    getStartedLink: "/onboarding",
  },
  {
    header: "Professional",
    description: "Standard choice for active lecturers",
    price: "11,250",
    pricePerCredit: "225",
    features: [
      "50 flexible credits",
      "Generate up to 250 questions",
      "Grade 50 exam questions",
      "Grade 100 cloze questions",
    ],
    tag: "Standard",
    getStartedLink: "/onboarding",
  },
  {
    header: "Power User",
    description: "For lecturers with multiple courses",
    price: "20,000",
    pricePerCredit: "200",
    features: [
      "100 flexible credits",
      "Generate up to 500 questions",
      "Grade 100 exam questions",
      "Grade 200 cloze questions",
    ],
    tag: "Recommended",
    getStartedLink: "/onboarding",
  },
  {
    header: "Expert",
    description: "Maximum flexibility for heavy users",
    price: "37,500",
    pricePerCredit: "150",
    features: [
      "250 flexible credits",
      "Generate up to 1,250 questions",
      "Grade 250 exam questions",
      "Grade 500 cloze questions",
    ],
    getStartedLink: "/onboarding",
  },
];

const Pricing = () => {
  return (
    <div className="px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto py-12">
        <section className="space-y-6">
          <h1 className="text-[#222222] text-4xl font-bold">Pricing</h1>
          <p className="text-xl leading-relaxed">
            This features a credit-based pricing designed for individual
            lecturers. Use credits to generate questions and grade exams with AI
            — pay only for what you use.
          </p>

          <div className="mt-10 space-y-6">
            <img src="/credit-icon.svg" alt="credit icon" className="w-10" />
            <h2 className="text-[#222222] text-3xl font-bold">
              What is 1 credit?
            </h2>
            <p className="text-xl">
              Each credit is a flexible unit that can be used for any of these
              actions:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {infoCards.map((card, idx) => (
              <InfoCard
                key={idx}
                icon={card.icon}
                header={card.header}
                description={card.description}
              />
            ))}
          </div>
        </section>

        <div className="my-20 text-center bg-[#1836B2] py-5 text-white rounded-xl">
          <p className=" font-bold">
            {" "}
            <LightbulbIcon className="text-yellow-500" /> For Individual
            Lecturers:{" "}
            <span className=" font-medium">
              Choose the package that fits your teaching needs
            </span>
          </p>
        </div>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pricingPlans.map((plan, idx) => (
            <PricingCard key={idx} {...plan} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default Pricing;
