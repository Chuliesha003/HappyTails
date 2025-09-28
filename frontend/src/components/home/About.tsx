import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Shield, Award, Target, Zap } from "lucide-react";

const About: React.FC = () => (
  <section className="py-16 px-4 max-w-6xl mx-auto">
    {/* Hero Section */}
    <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-xl p-10 md:p-16 flex flex-col items-center mb-16 border border-purple-100">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg mb-8">
        <span className="text-6xl">🐾</span>
      </div>
      <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 tracking-tight">
        About HappyTails
      </h2>
      <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed text-center">
        HappyTails is a comprehensive digital platform revolutionizing pet healthcare through innovative technology and compassionate care. We bridge the gap between pet owners and veterinary professionals, ensuring every pet receives the attention they deserve.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
          Trusted by 10,000+ Pet Owners
        </Badge>
        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
          500+ Partner Veterinarians
        </Badge>
        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
          Available 24/7
        </Badge>
      </div>
    </div>

    {/* Mission & Vision */}
    <div className="grid md:grid-cols-2 gap-8 mb-16">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl text-blue-600">
            <Target className="h-8 w-8" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-lg leading-relaxed">
            To democratize access to quality veterinary care by providing a seamless, technology-driven platform that connects pet owners with certified veterinarians, delivers accurate health information, and fosters a supportive community dedicated to pet wellness.
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-purple-600">
            <Heart className="h-8 w-8" />
            Our Vision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-lg leading-relaxed">
            A world where every pet receives timely, compassionate care regardless of location or circumstance. We envision a future where technology enhances, rather than replaces, the human-animal bond through informed, proactive pet healthcare.
          </p>
        </CardContent>
      </Card>
    </div>

    {/* Core Values */}
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Core Values</h3>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-green-600">Trust & Safety</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We prioritize the safety and well-being of pets above all else, working only with verified, licensed veterinary professionals.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-purple-600">Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Building a supportive network of pet owners, veterinarians, and animal welfare advocates working together for better pet care.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-orange-600">Innovation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Leveraging cutting-edge technology to make veterinary care more accessible, efficient, and personalized for every pet owner.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* What Sets Us Apart */}
    <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl text-gray-800 mb-4">What Sets HappyTails Apart</CardTitle>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're not just another pet care app – we're your comprehensive partner in pet wellness
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Expert Network</h4>
            <p className="text-sm text-gray-600">Access to board-certified veterinarians across multiple specialties</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Verified Professionals</h4>
            <p className="text-sm text-gray-600">All veterinarians undergo rigorous background and credential checks</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Compassionate Care</h4>
            <p className="text-sm text-gray-600">Every interaction guided by genuine concern for pet welfare</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">24/7 Support</h4>
            <p className="text-sm text-gray-600">Round-the-clock access to emergency resources and advice</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </section>
);

export default About;
