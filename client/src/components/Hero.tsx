import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedEvent {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  venueId: number;
  venue?: {
    name: string;
    city: string;
  };
}

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: featuredEvents = [], isLoading } = useQuery({
    queryKey: ['/api/events/featured'],
  });
  
  // Get venue details for each event
  const { data: venues = [] } = useQuery({
    queryKey: ['/api/venues'],
  });
  
  // Combine events with venue details
  const eventsWithVenues = featuredEvents.map((event: FeaturedEvent) => {
    const venue = venues.find((v: any) => v.id === event.venueId);
    return { ...event, venue };
  });
  
  // Auto slide functionality
  useEffect(() => {
    if (eventsWithVenues.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventsWithVenues.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [eventsWithVenues.length]);
  
  const nextSlide = () => {
    if (eventsWithVenues.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % eventsWithVenues.length);
  };
  
  const prevSlide = () => {
    if (eventsWithVenues.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + eventsWithVenues.length) % eventsWithVenues.length);
  };

  if (isLoading) {
    return (
      <section className="container mx-auto px-4">
        <Skeleton className="w-full h-[250px] md:h-[400px] rounded-xl" />
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4">
      {/* Hero Carousel */}
      <div className="relative overflow-hidden rounded-xl max-h-[400px]">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {eventsWithVenues.map((event: FeaturedEvent, index: number) => (
            <div key={event.id} className="hero-slide min-w-full relative">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-[250px] md:h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h2 className="text-white text-2xl md:text-4xl font-bold font-poppins">{event.title}</h2>
                <p className="text-white text-sm md:text-base mt-2">{event.description}</p>
                <div className="flex items-center mt-3">
                  <span className="bg-white/20 text-white text-xs rounded-full px-3 py-1 mr-2">
                    <i className="fas fa-calendar-alt mr-1"></i> {format(new Date(event.date), 'MMM d, yyyy')}
                  </span>
                  <span className="bg-white/20 text-white text-xs rounded-full px-3 py-1">
                    <i className="fas fa-map-marker-alt mr-1"></i> {event.venue?.name || 'Venue TBA'}
                  </span>
                </div>
                <Link href={`/events/${event.id}`}>
                  <button className="mt-4 bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-md font-medium text-sm md:text-base transition w-fit">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center"
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {eventsWithVenues.map((_: any, index: number) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full bg-white ${index === currentSlide ? 'opacity-100' : 'opacity-50'}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
