import { Helmet } from "react-helmet-async";
import { Shield, Eye, Lock, UserCheck, AlertTriangle } from "lucide-react";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - HappyTails</title>
        <meta name="description" content="Privacy Policy for HappyTails pet care platform" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">Your privacy and data security are our top priorities</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: October 12, 2025</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">We collect information in the following ways:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Account Information:</strong> Name, email, phone number when you register</li>
                  <li><strong>Pet Health Data:</strong> Medical records, vaccination history, symptoms, and treatment information</li>
                  <li><strong>Usage Data:</strong> How you interact with our platform, pages visited, features used</li>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                  <li><strong>Communication Data:</strong> Messages sent through our support system</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <UserCheck className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Service Provision</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Provide veterinary services</li>
                    <li>• Process appointments</li>
                    <li>• Maintain pet health records</li>
                    <li>• Send notifications</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Platform Improvement</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Analyze usage patterns</li>
                    <li>• Improve user experience</li>
                    <li>• Develop new features</li>
                    <li>• Ensure platform security</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Information Sharing & Security</h2>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="bg-purple-200 rounded-full p-3 w-12 h-12 mx-auto mb-2">
                      <Lock className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-purple-800">Encryption</h3>
                    <p className="text-sm text-purple-700">End-to-end encryption for all data</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-200 rounded-full p-3 w-12 h-12 mx-auto mb-2">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-purple-800">Compliance</h3>
                    <p className="text-sm text-purple-700">GDPR & local privacy laws</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-200 rounded-full p-3 w-12 h-12 mx-auto mb-2">
                      <UserCheck className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-purple-800">Access Control</h3>
                    <p className="text-sm text-purple-700">Strict access permissions</p>
                  </div>
                </div>
                <p className="text-gray-700 text-center">
                  We never sell your data. Sharing only occurs with your explicit consent or as required by law.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Your Rights & Controls</h2>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">You have the following rights regarding your data:</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Access your personal data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Correct inaccurate data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Delete your data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Data portability</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Opt-out of marketing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Withdraw consent</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Our Privacy Team</h2>
              <p className="text-gray-700 mb-4">
                Questions about this Privacy Policy or your data rights? We're here to help.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-blue-600">privacy@happytails.app</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Phone</h3>
                  <p className="text-blue-600">+94 11 123 4567</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;