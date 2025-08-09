import { Helmet } from "react-helmet-async";
import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import Testimonials from "@/components/home/Testimonials";

const Index = () => {
  return (
    <main>
      <Helmet>
        <title>HappyTails – Pet Health Management</title>
        <meta name="description" content="Find vets, check symptoms with AI, manage pet records, and learn trusted care tips—friendly and professional." />
        <link rel="canonical" href="/" />
      </Helmet>
      <Hero />
      <FeatureGrid />
      <Testimonials />
    </main>
  );
};

export default Index;
