import { Helmet } from "react-helmet-async";
import { FileText, Users, AlertCircle, Stethoscope, Scale, Phone } from "lucide-react";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - HappyTails</title>
        <meta name="description" content="Terms of Service for HappyTails pet care platform" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <FileText className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">Guidelines for using HappyTails platform</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: October 12, 2025</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Acceptance of Terms</h2>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  By accessing and using HappyTails, you accept and agree to be bound by the terms and provision of this agreement.
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Use License</h2>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">✅ Permitted Uses</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Personal, non-commercial use</li>
                      <li>• Managing pet health records</li>
                      <li>• Booking veterinary appointments</li>
                      <li>• Accessing educational resources</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">❌ Prohibited Uses</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Commercial exploitation</li>
                      <li>• Unauthorized data scraping</li>
                      <li>• Impersonating others</li>
                      <li>• Violating local laws</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">User Responsibilities</h2>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-800 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">Account Security</h3>
                      <p className="text-sm text-green-700">Maintain confidentiality of your account credentials and accept responsibility for all activities under your account.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-800 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">Accurate Information</h3>
                      <p className="text-sm text-green-700">Provide accurate and up-to-date information about yourself and your pets.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-800 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">Lawful Use</h3>
                      <p className="text-sm text-green-700">Use the platform only for lawful purposes and in compliance with applicable laws.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Stethoscope className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Medical Disclaimer</h2>
              </div>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">Important Medical Notice</h3>
                    <p className="text-red-700 text-sm mb-3">
                      Our AI symptom checker and veterinary information are provided for educational purposes only.
                      They do not constitute medical advice, diagnosis, or treatment.
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-700">
                        <strong>Always consult qualified veterinary professionals for medical decisions.</strong>
                        Emergency situations require immediate attention from licensed veterinarians.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Limitation of Liability</h2>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">In no event shall HappyTails be liable for:</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Indirect or consequential damages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Loss of profits or data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Service interruptions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Third-party actions</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Maximum liability limited to fees paid in the 12 months preceding the claim.
                </p>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-700 mb-4">
                Questions about these Terms of Service? Our team is here to assist you.
              </p>
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-600 font-medium">+94 11 123 4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-600 font-medium">legal@happytails.app</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;