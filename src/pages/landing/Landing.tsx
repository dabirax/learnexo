import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import TheTeam from "./TheTeam";
import Recommendation from "./Recommendation";
import StartToday from "./StartToday";
import LandingFooter from "../../components/ui/landing/LandingFooter";
import ConcentricCircles from "@/components/ui/landing/ConcentricCircles";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

const Landing = () => {
  useDocumentTitle("Home");
  return (
    <div className="bg-white z-20 max-w-[1440px] mx-auto">
      <Hero />
      <HowItWorks />
      <Features />
      <TheTeam />
      <Recommendation />
      <StartToday />
      <LandingFooter />

      <ConcentricCircles position="lg:top-30 lg:left-40 top-20 -left-12" />
      <ConcentricCircles position="lg:top-80 lg:right-8 top-100 -right-12" />
    </div>
  );
};

export default Landing;
