import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface Artist {
  id: number;
  name: string;
  type: string;
  image: string;
}

const FeaturedArtists = () => {
  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['/api/artists'],
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
            <div key={index} className="flex flex-col items-center">
              <Skeleton className="w-24 h-24 rounded-full mb-2" />
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold font-poppins">Featured Artists</h2>
        <Link href="/artists" className="text-primary text-sm font-medium">
          View All <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {artists.map((artist: Artist) => (
          <Link key={artist.id} href={`/artists/${artist.id}`}>
            <a className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-medium">{artist.name}</h3>
              <p className="text-xs text-neutral-600">{artist.type}</p>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedArtists;
