import { Helmet } from "react-helmet-async";
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Phone, Mail, PawPrint } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "What is HappyTails?",
      answer: "HappyTails is a comprehensive pet care platform that helps pet owners manage their companion animals' health, find veterinarians, book appointments, and access educational resources. We combine AI-powered tools with professional veterinary services to provide complete pet care solutions.",
      icon: <PawPrint className="h-5 w-5" />
    },
    {
      question: "How does the AI Symptom Checker work?",
      answer: "Our AI Symptom Checker uses advanced algorithms trained on veterinary medical data to analyze symptoms you describe. It provides preliminary insights and recommendations, but it's designed to complement professional veterinary care, not replace it. Always consult a licensed veterinarian for accurate diagnosis and treatment.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "Is my pet's information secure?",
      answer: "Absolutely. We implement bank-level security measures including end-to-end encryption, secure data centers, and strict access controls. Your pet's health information is only accessible to you and authorized veterinary professionals. We comply with international privacy standards and never sell your data.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "How do I book an appointment?",
      answer: "Booking is simple: 1) Search for veterinarians in your area, 2) View their availability and services, 3) Select a convenient time slot, 4) Provide your pet's basic information, 5) Confirm your booking. You'll receive instant confirmation and reminders via email and SMS.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "Are the veterinarians verified?",
      answer: "Yes, all veterinarians on our platform undergo rigorous verification. We check their licenses, credentials, insurance, and professional standing. We also collect reviews from their patients and monitor service quality continuously to maintain our high standards.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "What if I need emergency veterinary care?",
      answer: "For emergencies, immediately contact your nearest 24/7 emergency veterinary clinic. Our platform is designed for non-emergency wellness care, routine check-ups, and scheduled appointments. We provide a directory of emergency services in your area.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "How do I update my pet's records?",
      answer: "In your dashboard, go to 'Pet Records' and select the pet you want to update. You can add vaccination records, medical history, medications, allergies, and other important health information. All updates are securely stored and can be shared with veterinarians.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "Can I cancel or reschedule appointments?",
      answer: "Yes, you can manage your appointments through your dashboard. Most appointments can be rescheduled up to 24 hours in advance without fees. Cancellations made with less notice may incur a small fee to compensate veterinary practices for lost time.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards (Visa, MasterCard, American Express), digital wallets (Apple Pay, Google Pay), and bank transfers. All payments are processed through secure, PCI-compliant gateways. Veterinary services may have their own payment policies.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "Is there a mobile app?",
      answer: "We're currently developing mobile apps for iOS and Android with enhanced features like push notifications, offline access to pet records, and quick appointment booking. Sign up for our newsletter to be notified when apps become available.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our support team through multiple channels: email (hello@happytails.app), phone (+94 11 123 4567), or our in-app chat feature. We typically respond within 2 hours during business hours and within 24 hours on weekends.",
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      question: "Do you offer telemedicine consultations?",
      answer: "Yes, many of our partner veterinarians offer virtual consultations for certain conditions. You can filter for telemedicine-enabled vets when searching. Virtual visits are conducted through our secure video platform and are subject to the same privacy standards.",
      icon: <HelpCircle className="h-5 w-5" />
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - HappyTails</title>
        <meta name="description" content="Frequently Asked Questions for HappyTails pet care platform" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">Find answers to common questions about HappyTails</p>
            <p className="text-sm text-gray-500 mt-2">Can't find what you're looking for? Contact our support team.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Common Questions</h2>
                <span className="text-sm text-gray-500">{faqData.length} questions</span>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {faqData.map((item, index) => (
                <div key={index} className="border-b border-gray-100 last:border-b-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-cyan-600">
                        {item.icon}
                      </div>
                      <span className="font-medium text-gray-900">{item.question}</span>
                    </div>
                    <div className="text-gray-400">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </button>

                  {openItems.includes(index) && (
                    <div className="px-6 pb-4 bg-gray-50">
                      <div className="pt-2">
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-lg p-8 text-center">
            <MessageCircle className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 p-3 bg-cyan-50 rounded-lg">
                <Mail className="h-5 w-5 text-cyan-600" />
                <div className="text-left">
                  <p className="font-medium text-cyan-800">Email Support</p>
                  <p className="text-sm text-cyan-600">hello@happytails.app</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-cyan-50 rounded-lg">
                <Phone className="h-5 w-5 text-cyan-600" />
                <div className="text-left">
                  <p className="font-medium text-cyan-800">Phone Support</p>
                  <p className="text-sm text-cyan-600">+94 11 123 4567</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-medium">
                Start Live Chat
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              These FAQs are updated regularly. Last updated: October 12, 2025
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;