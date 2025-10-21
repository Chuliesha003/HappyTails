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
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Keyboard className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Keyboard Navigation</h3>
                      <p className="text-sm text-gray-600">Full keyboard accessibility for all interactive elements</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Volume2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Screen Reader Support</h3>
                      <p className="text-sm text-gray-600">Compatible with popular screen readers (NVDA, JAWS, VoiceOver)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">High Contrast Mode</h3>
                      <p className="text-sm text-gray-600">Supports high contrast themes and color adjustments</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Monitor className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Resizable Text</h3>
                      <p className="text-sm text-gray-600">Text scales properly without loss of functionality</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Alt Text & Captions</h3>
                      <p className="text-sm text-gray-600">Descriptive alternative text for images and captions for videos</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AccessibilityIcon className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Focus Indicators</h3>
                      <p className="text-sm text-gray-600">Clear visual indicators for keyboard focus</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Conformance Status</h2>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-orange-800">WCAG 2.1 Level AA Compliant</h3>
                </div>
                <p className="text-orange-700 mb-4">
                  We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA.
                  These guidelines explain how to make web content more accessible to people with disabilities.
                </p>
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-semibold text-gray-800 mb-2">Key Principles:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><strong>Perceivable:</strong> Information and user interface components must be presentable to users in ways they can perceive</li>
                    <li><strong>Operable:</strong> User interface components and navigation must be operable</li>
                    <li><strong>Understandable:</strong> Information and the operation of user interface must be understandable</li>
                    <li><strong>Robust:</strong> Content must be robust enough to be interpreted reliably by a wide variety of user agents</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Feedback & Support</h2>
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg">
                <p className="text-indigo-700 mb-4">
                  We welcome your feedback on the accessibility of HappyTails. Please let us know if you encounter accessibility barriers.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-indigo-800 mb-2">Report Issues</h4>
                    <p className="text-sm text-gray-600 mb-2">Found an accessibility problem?</p>
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors">
                      Report Issue
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-indigo-800 mb-2">Request Accommodations</h4>
                    <p className="text-sm text-gray-600 mb-2">Need additional support?</p>
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Monitor className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Technical Specifications</h2>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-teal-700 mb-3">
                  Accessibility of HappyTails relies on the following technologies:
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded border text-center">
                    <h4 className="font-semibold text-teal-800">HTML5</h4>
                    <p className="text-sm text-teal-700">Semantic markup</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <h4 className="font-semibold text-teal-800">CSS3</h4>
                    <p className="text-sm text-teal-700">Responsive design</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <h4 className="font-semibold text-teal-800">JavaScript</h4>
                    <p className="text-sm text-teal-700">Enhanced interactions</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <h4 className="font-semibold text-teal-800">TypeScript</h4>
                    <p className="text-sm text-teal-700">Typing & reliability</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <h4 className="font-semibold text-teal-800">React</h4>
                    <p className="text-sm text-teal-700">Component-based UI</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <h4 className="font-semibold text-teal-800">Tailwind CSS</h4>
                    <p className="text-sm text-teal-700">Utility-first styling</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <h4 className="font-semibold text-teal-800">Node.js & Express</h4>
                    <p className="text-sm text-teal-700">Backend APIs</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                Questions or concerns about accessibility? Our team is here to help.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Accessibility Support</h3>
                  <p className="text-blue-600">accessibility@happytails.app</p>
                  <p className="text-sm text-gray-600 mt-1">Response within 24 hours</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">General Support</h3>
                  <p className="text-blue-600">+94 11 123 4567</p>
                  <p className="text-sm text-gray-600 mt-1">Mon-Fri, 9AM-6PM</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accessibility;