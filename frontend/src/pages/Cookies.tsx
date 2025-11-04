import { Helmet } from "react-helmet-async";
import { Cookie, Settings, BarChart3 } from "lucide-react";

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
            <p className="text-lg text-gray-600">Understanding how we store data to provide our services</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: November 4, 2025</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <div className="flex items-center mb-4">
                <Cookie className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">What Are Cookies</h2>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  HappyTails uses browser storage technologies to provide you with essential features and functionality.
                  We primarily use <strong>localStorage</strong>, which stores data locally in your browser to maintain your session and preferences.
                </p>
                <div className="bg-white p-4 rounded border">
                  <h3 className="font-semibold text-gray-800 mb-2">What is localStorage?</h3>
                  <p className="text-sm text-gray-600">
                    localStorage is a browser feature that stores data on your device. Unlike traditional cookies, this data doesn't expire automatically
                    and is only accessible by our website. It helps us keep you logged in and remember your settings.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">What We Store</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <h3 className="font-semibold text-green-800">Authentication Data</h3>
                    <span className="ml-2 text-xs bg-green-200 text-green-700 px-2 py-1 rounded">Essential</span>
                  </div>
                  <p className="text-green-700 text-sm mb-2">
                    We store authentication information in your browser's localStorage to keep you logged in and provide access to your account.
                  </p>
                  <div className="bg-white p-3 rounded border border-green-200">
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">What we store:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>happytails_token</strong> - Your authentication token for secure access</li>
                      <li>• <strong>happytails_user</strong> - Your user information (name, email, role)</li>
                    </ul>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    <strong>Note:</strong> This data is only stored locally in your browser and is necessary for the website to function properly.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-blue-800 mb-2">We Do NOT Use:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✗ Analytics or tracking cookies</li>
                    <li>✗ Marketing or advertising cookies</li>
                    <li>✗ Third-party tracking technologies</li>
                    <li>✗ Social media cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Managing Your Data</h2>
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="font-semibold text-indigo-800 mb-3">How to Clear Your Data</h3>
                <p className="text-indigo-700 text-sm mb-4">
                  You can clear your stored data at any time by logging out of your account or clearing your browser's localStorage.
                </p>
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-semibold text-gray-800 mb-2">To clear localStorage in your browser:</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li><strong>Chrome/Edge:</strong> Press F12 → Application tab → Local Storage → Right-click → Clear</li>
                    <li><strong>Firefox:</strong> Press F12 → Storage tab → Local Storage → Right-click → Delete All</li>
                    <li><strong>Safari:</strong> Develop menu → Show Web Inspector → Storage tab → Local Storage → Delete</li>
                  </ul>
                </div>
                <div className="bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded mt-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Clearing localStorage will log you out of your account and you'll need to sign in again.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cookies;