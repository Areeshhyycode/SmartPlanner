import {
  HeroSection,
  ExploreAdventures,
  HowItWorks,
  TrustSection,
  CTASection,
} from '../components/home';

function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ExploreAdventures />
      <HowItWorks />
      <TrustSection />
      <CTASection />
    </div>
  );
}

export default HomePage;
