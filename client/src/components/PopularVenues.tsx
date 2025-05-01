import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface Venue {
  id: number;
  name: string;
  city: string;
  image: string;
}

const PopularVenues = () => {
  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['/api/venues'],
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-20" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="w-full h-32 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold font-poppins">Popular Venues</h2>
        <Link href="/venues" className="text-primary text-sm font-medium">
          View All <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {venues.map((venue: Venue) => (
          <Link key={venue.id} href={`/venues/${venue.id}`}>
            <a className="relative rounded-lg overflow-hidden group block">
              <img 
                src={venue.image} 
                alt={venue.name} 
                className="w-full h-32 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <h3 className="text-white text-sm font-medium">{venue.name}</h3>
                <p className="text-white/80 text-xs">{venue.city}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularVenues;
