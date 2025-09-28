import { Helmet } from "react-helmet-async";
import AboutComponent from "@/components/home/About";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Helmet>
        <title>About HappyTails - Where Paw-sitive Care Meets Technology</title>
        <meta name="description" content="Discover the heart behind HappyTails. We're not just an app – we're a movement dedicated to making pet care as easy as a tail wag. Join thousands of happy pets and their families!" />
        <link rel="canonical" href="/about" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <AboutComponent />
      </div>
    </div>
  );
};

export default About;