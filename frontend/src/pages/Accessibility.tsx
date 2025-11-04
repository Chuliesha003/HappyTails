import { Helmet } from "react-helmet-async";
import { Accessibility as AccessibilityIcon, CheckCircle, Monitor, Keyboard, Volume2, Eye, Users, MessageSquare } from "lucide-react";

const Accessibility = () => {
  return (
    <>
      <Helmet>
        <title>Accessibility Statement - HappyTails</title>
        <meta name="description" content="Accessibility Statement for HappyTails pet care platform" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <AccessibilityIcon className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Accessibility Statement</h1>
            <p className="text-lg text-gray-600">Committed to digital accessibility for all users</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: October 12, 2025</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Our Commitment</h2>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-blue-700 mb-4">
                  HappyTails is committed to ensuring digital accessibility for people with disabilities.
                  We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">WCAG 2.1 AA</h3>
                    <p className="text-sm text-gray-600">Compliance Standard</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">Inclusive Design</h3>
                    <p className="text-sm text-gray-600">For All Users</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
                    <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">Ongoing</h3>
                    <p className="text-sm text-gray-600">Continuous Improvement</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Monitor className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Accessibility Features</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Semantic HTML</h3>
                    <p className="text-sm text-gray-600">Proper HTML structure with semantic elements for better screen reader compatibility</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">ARIA Labels</h3>
                    <p className="text-sm text-gray-600">Interactive elements include descriptive ARIA labels for assistive technologies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Alternative Text</h3>
                    <p className="text-sm text-gray-600">Images include descriptive alt text for screen readers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Monitor className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Responsive Design</h3>
                    <p className="text-sm text-gray-600">Mobile-first design using Tailwind CSS that adapts to different screen sizes and devices</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Eye className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Readable Text</h3>
                    <p className="text-sm text-gray-600">Clear typography with sufficient color contrast for readability</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Keyboard className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Keyboard-Friendly Forms</h3>
                    <p className="text-sm text-gray-600">Forms can be navigated and submitted using keyboard controls</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Our Accessibility Goals</h2>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-orange-800">Working Towards WCAG 2.1 Level AA</h3>
                </div>
                <p className="text-orange-700 mb-4">
                  HappyTails is actively working to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
                  We are continuously improving our website to ensure all users can access our pet care services.
                </p>
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-semibold text-gray-800 mb-2">Current Implementation:</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>✓ Semantic HTML structure throughout the website</li>
                    <li>✓ ARIA labels on interactive elements</li>
                    <li>✓ Alternative text for images</li>
                    <li>✓ Responsive, mobile-friendly design</li>
                    <li>✓ Readable typography and sufficient color contrast</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Feedback & Continuous Improvement</h2>
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg">
                <p className="text-indigo-700 mb-4">
                  We welcome your feedback on the accessibility of HappyTails. If you encounter any accessibility barriers or have suggestions for improvement, please reach out to us at <strong>support@happytails.lk</strong>.
                </p>
                <p className="text-indigo-700">
                  Your feedback helps us make HappyTails more accessible for everyone.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Monitor className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Technical Specifications</h2>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-teal-700 mb-3">
                  HappyTails is built with modern web technologies:
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded border text-center">
                    <h4 className="font-semibold text-teal-800">React + TypeScript</h4>
                    <p className="text-sm text-teal-700">Component-based frontend</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <h4 className="font-semibold text-teal-800">Tailwind CSS</h4>
                    <p className="text-sm text-teal-700">Responsive styling</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <h4 className="font-semibold text-teal-800">Node.js + Express</h4>
                    <p className="text-sm text-teal-700">Backend server</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                Questions or concerns about accessibility? We welcome your feedback to help us improve.
              </p>
              <div>
                <h3 className="font-semibold text-gray-800">Email Us</h3>
                <p className="text-blue-600">support@happytails.lk</p>
                <p className="text-sm text-gray-600 mt-1">We'll respond as soon as possible</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accessibility;