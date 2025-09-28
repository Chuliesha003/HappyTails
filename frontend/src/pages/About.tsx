import { Helmet } from "react-helmet-async";
import AboutComponent from "@/components/home/About";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Helmet>
        <title>About HappyTails - Revolutionizing Pet Healthcare</title>
        <meta name="description" content="Discover HappyTails' mission to transform pet healthcare through technology. Learn about our commitment to connecting pet owners with trusted veterinarians and providing comprehensive pet wellness resources." />
        <link rel="canonical" href="/about" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <AboutComponent />
      </div>
    </div>
  );
};

export default About;