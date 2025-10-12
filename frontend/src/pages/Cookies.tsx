import { Helmet } from "react-helmet-async";
import { Cookie, Settings, BarChart3, Heart, Globe, Shield } from "lucide-react";

const Cookies = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - HappyTails</title>
        <meta name="description" content="Cookie Policy for HappyTails pet care platform" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <Cookie className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-lg text-gray-600">Understanding how we use cookies to improve your experience</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: October 12, 2025</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <div className="flex items-center mb-4">
                <Cookie className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">What Are Cookies</h2>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are stored on your computer or mobile device when you visit our website.
                  They help us provide you with a better browsing experience and allow certain features to work properly.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded border">
                    <Cookie className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">Small Files</h3>
                    <p className="text-sm text-gray-600">Typically under 4KB</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <Settings className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">Browser Storage</h3>
                    <p className="text-sm text-gray-600">Stored by your browser</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">Website Data</h3>
                    <p className="text-sm text-gray-600">Contains usage information</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Types of Cookies We Use</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-green-800">Essential Cookies</h3>
                    <span className="ml-2 text-xs bg-green-200 text-green-700 px-2 py-1 rounded">Always Active</span>
                  </div>
                  <p className="text-green-700 text-sm">Required for the website to function properly. Cannot be disabled.</p>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• User authentication and session management</li>
                    <li>• Security features and fraud prevention</li>
                    <li>• Basic website functionality</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-blue-800">Analytics Cookies</h3>
                    <span className="ml-2 text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">Optional</span>
                  </div>
                  <p className="text-blue-700 text-sm">Help us understand how visitors interact with our website.</p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Page views and user journey tracking</li>
                    <li>• Feature usage statistics</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-purple-800">Functional Cookies</h3>
                    <span className="ml-2 text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">Optional</span>
                  </div>
                  <p className="text-purple-700 text-sm">Remember your preferences and settings for a personalized experience.</p>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>• Language and location preferences</li>
                    <li>• Theme and display settings</li>
                    <li>• Form data preservation</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-orange-800">Marketing Cookies</h3>
                    <span className="ml-2 text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded">Optional</span>
                  </div>
                  <p className="text-orange-700 text-sm">Used to deliver relevant advertisements and track campaign effectiveness.</p>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Targeted advertising</li>
                    <li>• Social media integration</li>
                    <li>• Campaign performance tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Managing Your Cookies</h2>
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="font-semibold text-indigo-800 mb-3">Browser Settings</h3>
                <p className="text-indigo-700 text-sm mb-4">
                  You can control and manage cookies through your browser settings. Most browsers allow you to:
                </p>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm">View what cookies are stored</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm">Delete all or specific cookies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm">Block cookies from specific sites</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm">Block all cookies</span>
                  </div>
                </div>
                <div className="bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website and limit your user experience.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Third-Party Cookies</h2>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-700 mb-3">
                  Some cookies may be set by third-party services that appear on our pages, such as:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-semibold text-gray-800">Analytics Services</h4>
                    <p className="text-sm text-gray-600">Google Analytics, Mixpanel</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-semibold text-gray-800">Social Media</h4>
                    <p className="text-sm text-gray-600">Facebook, Twitter, Instagram</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-semibold text-gray-800">Payment Processors</h4>
                    <p className="text-sm text-gray-600">Stripe, PayPal</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-semibold text-gray-800">Customer Support</h4>
                    <p className="text-sm text-gray-600">Intercom, Zendesk</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookie Preferences</h2>
              <p className="text-gray-700 mb-4">
                You can manage your cookie preferences at any time by visiting our cookie settings page or contacting us.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Manage Preferences
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cookies;