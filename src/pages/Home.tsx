import Hero from '../components/sections/Hero';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import CityStats from '../components/home/CityStats';
import Map from '../components/home/Map';
import Weather from '../components/home/Weather';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="Official website of your local government. Access government services, information, and resources."
        keywords="government, local government, services, public services, civic services"
      />
      <main className="flex-grow">
        <Hero />
        <CityStats />
        <ServicesSection />
        <GovernmentActivitySection />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
          <Map />
          <Weather />
        </div>
      </main>
    </>
  );
};

export default Home;
