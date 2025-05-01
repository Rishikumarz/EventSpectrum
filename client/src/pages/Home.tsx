import { useEffect } from "react";
import Hero from "@/components/Hero";
import EventCategories from "@/components/EventCategories";
import TrendingEvents from "@/components/TrendingEvents";
import PopularVenues from "@/components/PopularVenues";
import FeaturedArtists from "@/components/FeaturedArtists";
import { Button } from "@/components/ui/button";

const Home = () => {
  // Set page title
  useEffect(() => {
    document.title = "EventSpot - Book Indian Events & Shows";
  }, []);

  return (
    <main className="pt-24 md:pt-16 pb-16">
      {/* Hero Section */}
      <Hero />
      
      {/* Categories Section */}
      <EventCategories />
      
      {/* Trending Events Section */}
      <TrendingEvents />
      
      {/* Popular Venues Section */}
      <PopularVenues />
      
      {/* Featured Artists Section */}
      <FeaturedArtists />
      
      {/* Call To Action */}
      <section className="container mx-auto px-4 mt-10">
        <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-6 md:p-8 text-white">
          <div className="md:flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-poppins">Register your event with us</h2>
              <p className="mt-2 text-white/80 max-w-lg">Are you organizing an event? List it on EventSpot and reach thousands of potential attendees.</p>
            </div>
            <Button className="mt-4 md:mt-0 bg-white text-primary hover:bg-white/90">
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
