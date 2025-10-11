import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Shield, Award, Target, Zap, Star, PawPrint, Bone, Sparkles } from "lucide-react";

const About: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Hero Section with Floating Elements */}
      <div className="relative mb-20">
        {/* Floating decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-100 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-20 -right-5 w-16 h-16 bg-pink-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-purple-100 rounded-full opacity-25 animate-bounce" style={{animationDelay: '1s'}}></div>

        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 shadow-2xl mb-8 transform hover:scale-105 transition-transform">
            <PawPrint className="w-16 h-16 text-white" />
          </div>

          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-6 leading-tight">
            HappyTails
          </h1>

          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-2xl text-gray-800 mb-4 font-light leading-relaxed">
              Where <span className="font-bold text-purple-600">paw-sitive</span> care meets
              <span className="font-bold text-pink-600"> cutting-edge</span> technology
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We're not just building an app – we're creating a movement. A world where every wag of a tail and purr of contentment is celebrated, supported, and protected.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-200">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-gray-800">10,000+ Happy Pets</span>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-pink-200">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-800">500+ Vet Partners</span>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-200">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-pink-600" />
                <span className="font-semibold text-gray-800">24/7 Care Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-800 leading-tight">
              Born from a <span className="text-purple-600">Simple Idea</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              It started with a single question: "Why should finding a vet feel like solving a puzzle?" We saw pet parents struggling to connect with quality care, drowning in confusing information, and making rushed decisions about their furry family members.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              So we built HappyTails – not just another app, but a trusted companion in your pet parenting journey. We're here to make every "tail" wag with joy and every purr resonate with health.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Founded with Heart</p>
                <p className="text-sm text-gray-600">Every feature designed by pet lovers, for pet lovers</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Bone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Our Promise</h3>
                    <p className="text-sm text-gray-600">Quality care, accessible to all</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "We believe every pet deserves the same level of care and attention we'd give our own. HappyTails is our way of making that belief a reality for pet parents everywhere."
                </p>
                <div className="mt-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">Trusted by thousands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Values in a Fun Layout */}
      <div className="mb-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
          What Makes Us <span className="text-pink-600">Purr-fect</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Target className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-purple-600 mb-2">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 leading-relaxed">
                To create a world where finding quality veterinary care is as easy as teaching your dog to fetch. We're bridging the gap between pet parents and expert care, one happy tail at a time.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-pink-50 to-pink-100 hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-pink-600 mb-2">Our Heart</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 leading-relaxed">
                Every line of code, every feature, every partnership – all driven by our unwavering love for animals. We're not just developers; we're fellow pet parents on a mission.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-100 hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-purple-600 mb-2">Our Spark</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 leading-relaxed">
                Innovation meets compassion. We're constantly evolving, adding new features, and pushing boundaries to make pet care better, faster, and more accessible than ever before.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fun Stats Section */}
      <div className="bg-white rounded-3xl p-12 text-center shadow-2xl">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">Join Our Growing Family</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
            <div className="text-4xl font-bold mb-2 text-purple-700">10K+</div>
            <div className="text-lg text-purple-600">Happy Pets</div>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6">
            <div className="text-4xl font-bold mb-2 text-pink-700">500+</div>
            <div className="text-lg text-pink-600">Vet Partners</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
            <div className="text-4xl font-bold mb-2 text-purple-700">24/7</div>
            <div className="text-lg text-purple-600">Support</div>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6">
            <div className="text-4xl font-bold mb-2 text-pink-700">4.9★</div>
            <div className="text-lg text-pink-600">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default About;
