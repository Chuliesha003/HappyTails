import React from "react";

const About: React.FC = () => (
  <section className="py-16 px-4 max-w-4xl mx-auto">
    <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-3xl shadow-xl p-10 md:p-16 flex flex-col items-center mb-12 border border-purple-200">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 shadow-lg mb-6">
        <span className="text-5xl">🐾</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-4 tracking-tight drop-shadow">About HappyTails</h2>
      <p className="text-xl text-gray-700 mb-4 max-w-2xl mx-auto">
        HappyTails is dedicated to providing the best care and resources for your beloved pets. Our platform connects pet owners with trusted veterinarians, offers appointment booking, and provides valuable resources to keep your pets healthy and happy.
      </p>
      <p className="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">
        Whether you are a new pet parent or an experienced one, HappyTails is here to support you every step of the way. Explore our features, connect with experts, and join our community of pet lovers!
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-purple-400">
        <h3 className="text-2xl font-bold mb-3 text-purple-600 flex items-center gap-2">
          <span className="text-3xl">🌟</span> Our Vision
        </h3>
        <p className="text-gray-700 text-md">
          To create a world where every pet receives the love, care, and medical attention they deserve, empowering pet owners with knowledge and access to trusted veterinary services.
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-pink-400">
        <h3 className="text-2xl font-bold mb-3 text-pink-600 flex items-center gap-2">
          <span className="text-3xl">🎯</span> Our Mission
        </h3>
        <p className="text-gray-700 text-md">
          To provide a comprehensive, user-friendly platform that connects pet owners with expert veterinarians, delivers reliable pet health resources, and fosters a supportive community dedicated to the well-being of all pets.
        </p>
      </div>
    </div>
  </section>
);

export default About;
