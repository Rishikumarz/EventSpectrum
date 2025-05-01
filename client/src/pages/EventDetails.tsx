import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Clock, Users, TicketIcon, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

const EventDetails = () => {
  const [match, params] = useRoute("/events/:id");
  const eventId = params?.id ? parseInt(params.id) : null;
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId
  });
  
  const { data: venue } = useQuery({
    queryKey: [`/api/venues/${event?.venueId}`],
    enabled: !!event?.venueId
  });
  
  const { data: artist } = useQuery({
    queryKey: [`/api/artists/${event?.artistId}`],
    enabled: !!event?.artistId
  });
  
  useEffect(() => {
    if (event) {
      document.title = `${event.title} - EventSpot`;
    }
  }, [event]);
  
  const openAuthModal = () => {
    setIsModalOpen(true);
  };
  
  const closeAuthModal = () => {
    setIsModalOpen(false);
  };
  
  if (isEventLoading) {
    return (
      <main className="pt-24 md:pt-16 pb-16">
        <div className="container mx-auto px-4">
          <Skeleton className="w-full h-[300px] md:h-[400px] rounded-xl mb-6" />
          <div className="md:flex md:space-x-6">
            <div className="md:w-2/3">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-3/4 mb-6" />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-md" />
                ))}
              </div>
              
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>
            
            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-6" />
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-6" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  if (!event) {
    return (
      <main className="pt-24 md:pt-16 pb-16">
        <div className="container mx-auto px-4 text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 md:pt-16 pb-16">
      <div className="container mx-auto px-4">
        {/* Event Banner */}
        <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-6">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="md:flex md:space-x-6">
          {/* Left Column - Event Details */}
          <div className="md:w-2/3">
            <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-4">{event.title}</h1>
            
            {/* Event Meta */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <CalendarIcon size={14} />
                {format(new Date(event.date), "MMM d, yyyy")}
              </Badge>
              
              {venue && (
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <MapPin size={14} />
                  {venue.name}, {venue.city}
                </Badge>
              )}
              
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <Clock size={14} />
                {format(new Date(event.date), "h:mm a")}
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <Users size={14} />
                {event.availableSeats} seats left
              </Badge>
            </div>
            
            {/* Event Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Price Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-sm text-neutral-500 mb-1">Ticket Price</h3>
                <p className="text-xl font-bold">₹{event.price} <span className="text-sm font-normal text-neutral-500">onwards</span></p>
              </div>
              
              {/* Venue Card */}
              {venue && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-sm text-neutral-500 mb-1">Venue</h3>
                  <p className="font-medium">{venue.name}</p>
                  <p className="text-sm text-neutral-500">{venue.city}, {venue.state}</p>
                </div>
              )}
              
              {/* Artist Card */}
              {artist && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-sm text-neutral-500 mb-1">Featuring</h3>
                  <p className="font-medium">{artist.name}</p>
                  <p className="text-sm text-neutral-500">{artist.type}</p>
                </div>
              )}
            </div>
            
            {/* Event Description */}
            <h2 className="text-xl font-bold mb-3">About This Event</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-neutral-600">{event.description}</p>
            </div>
          </div>
          
          {/* Right Column - Booking Card */}
          <div className="md:w-1/3 mt-6 md:mt-0">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-2">Book Tickets</h2>
              <p className="text-neutral-500 mb-4">Secure your spot at this amazing event!</p>
              
              <div className="flex items-center justify-between py-3 border-b">
                <span>Price per ticket</span>
                <span className="font-bold">₹{event.price}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <span>Available seats</span>
                <span className="font-bold text-green-600">{event.availableSeats} / {event.totalSeats}</span>
              </div>
              
              {isAuthenticated ? (
                <Link href={`/booking/${event.id}`}>
                  <Button className="w-full mt-6 flex items-center justify-center gap-2">
                    <TicketIcon size={18} />
                    Book Now
                  </Button>
                </Link>
              ) : (
                <Button className="w-full mt-6" onClick={openAuthModal}>Login to Book</Button>
              )}
              
              <div className="mt-4 text-center">
                <button className="text-sm text-primary flex items-center justify-center gap-1 mx-auto">
                  <Share2 size={16} />
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </main>
  );
};

export default EventDetails;
