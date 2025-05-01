import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: number;
  title: string;
  image: string;
  date: string;
  price: number;
  venueId: number;
  venue?: {
    name: string;
    city: string;
  };
}

const TrendingEvents = () => {
  const { data: trendingEvents = [], isLoading } = useQuery({
    queryKey: ['/api/events/trending'],
  });
  
  // Get venue details for each event
  const { data: venues = [] } = useQuery({
    queryKey: ['/api/venues'],
  });
  
  // Combine events with venue details
  const eventsWithVenues = trendingEvents.map((event: Event) => {
    const venue = venues.find((v: any) => v.id === event.venueId);
    return { ...event, venue };
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-20" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Skeleton className="w-full h-40" />
              <div className="p-3">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-7 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold font-poppins">Trending Events</h2>
        <Link href="/events" className="text-primary text-sm font-medium">
          View All <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {eventsWithVenues.map((event: Event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <a className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group block">
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                  Trending
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                  <i className="fas fa-star text-yellow-400 mr-1"></i> 4.8
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-neutral-900 group-hover:text-primary transition">{event.title}</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  <i className="fas fa-calendar-day mr-1"></i> {format(new Date(event.date), 'MMM d, yyyy')}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  <i className="fas fa-map-marker-alt mr-1"></i> {event.venue ? `${event.venue.name}, ${event.venue.city}` : 'Venue TBA'}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-bold">₹{event.price} onwards</span>
                  <button className="text-xs bg-primary/10 hover:bg-primary/20 text-primary font-medium py-1 px-3 rounded transition">
                    Book Now
                  </button>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TrendingEvents;
