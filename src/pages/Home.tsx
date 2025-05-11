
import { useState } from "react";
import CardCarousel from "../components/home/CardCarousel";
import QuickLinks from "../components/home/QuickLinks";
import WelcomeHeader from "../components/home/WelcomeHeader";
import ErrorFallback from "../components/home/ErrorFallback";

const Home = () => {
  console.log("Home component rendering");
  const [isErrorState, setIsErrorState] = useState(false);
  
  // Fallback UI if we're in an error state
  if (isErrorState) {
    return <ErrorFallback />;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header Section */}
      <WelcomeHeader />
      
      {/* Card Carousel and Detail */}
      <CardCarousel onError={setIsErrorState} />
      
      {/* Quick Links for Mobile */}
      <QuickLinks />
    </div>
  );
};

export default Home;
