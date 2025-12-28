import Script from "next/script";

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the debt snowball method?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The debt snowball method is a debt payoff strategy popularized online where you pay off your debts in order of smallest to largest balance, instead of by interest rate. As each debt is paid off, you roll the payment amount into the next debt.",
      },
    },
    {
      "@type": "Question",
      name: "How does the snowball method calculator work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our free snowball method calculator helps you create a personalized debt payoff plan. Simply enter all your debts (balances, interest rates, and minimum payments), and the calculator will show you the optimal payment order, your debt-free date, and a detailed payment schedule.",
      },
    },
    {
      "@type": "Question",
      name: "Is the snowball method better than paying highest interest first?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The snowball method prioritizes paying off the smallest debts first, which can help some people stay motivated by achieving early progress. Paying the highest interest debt first (the avalanche method) may reduce total interest paid. Different approaches work better for different individuals depending on their goals and preferences.",
      },
    },
    {
      "@type": "Question",
      name: "How long will it take to pay off my debt using the snowball method?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The time it takes to become debt-free depends on your total debt amount, minimum payments, and how much extra you can pay each month. Our calculator will show you your exact debt-free date based on your specific situation.",
      },
    },
    {
      "@type": "Question",
      name: "Is the snowball calculator free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our debt snowball calculator is completely free to use. No credit card required, no hidden fees. Simply sign up to save your calculations and track your progress over time.",
      },
    },
  ],
};

export default function FAQStructuredData() {
  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}

