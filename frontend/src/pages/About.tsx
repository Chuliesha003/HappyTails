import { Helmet } from "react-helmet-async";
import AboutComponent from "@/components/home/About";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Helmet>
        <title>About Us – HappyTails</title>
        <meta name="description" content="Learn about HappyTails' mission to provide the best care and resources for your beloved pets. Our vision and values guide everything we do." />
        <link rel="canonical" href="/about" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <AboutComponent />
      </div>
    </div>
  );
};

export default About;