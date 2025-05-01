import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRequireAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const Booking = () => {
  const auth = useRequireAuth();
  const [match, params] = useRoute("/booking/:id");
  const eventId = params?.id ? parseInt(params.id) : null;
  const [quantity, setQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId
  });
  
  const { data: venue } = useQuery({
    queryKey: [`/api/venues/${event?.venueId}`],
    enabled: !!event?.venueId
  });
  
  // Mutation for creating a booking
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: {
      eventId: number;
      numberOfSeats: number;
      seatNumbers: number[];
    }) => {
      // The apiRequest already includes credentials: 'include' by default
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/bookings/user'] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
      
      toast({
        title: "Booking Successful",
        description: "Your tickets have been booked successfully!",
        variant: "default",
      });
      
      // Redirect to profile page
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your tickets. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  useEffect(() => {
    if (event) {
      document.title = `Book Tickets: ${event.title} - EventSpot`;
    }
  }, [event]);
  
  // Handle seat selection (simplified for demo)
  useEffect(() => {
    if (quantity > 0) {
      // Generate sequential seat numbers for simplicity
      const seats = Array.from({ length: quantity }, (_, i) => i + 1);
      setSelectedSeats(seats);
    } else {
      setSelectedSeats([]);
    }
  }, [quantity]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= (event?.availableSeats || 0)) {
      setQuantity(value);
    }
  };
  
  const handleBooking = async () => {
    if (!event || !eventId) return;
    
    if (quantity <= 0 || quantity > event.availableSeats) {
      toast({
        title: "Invalid Selection",
        description: "Please select a valid number of tickets.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createBookingMutation.mutateAsync({
        eventId,
        numberOfSeats: quantity,
        seatNumbers: selectedSeats
      });
    } catch (error) {
      // Error handled in mutation
    }
  };
  
  if (isEventLoading) {
    return (
      <main className="pt-24 md:pt-16 pb-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-[200px] w-full rounded-xl mb-4" />
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-6 w-full mb-1" />
              <Skeleton className="h-6 w-full mb-1" />
              <Skeleton className="h-6 w-3/4 mb-6" />
            </div>
            <div>
              <div className="bg-white rounded-xl shadow-sm">
                <Skeleton className="h-8 w-48 m-4" />
                <div className="px-4 pb-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-4" />
                  <Skeleton className="h-12 w-full" />
                </div>
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
          <p className="mb-6">The event you're trying to book doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 md:pt-16 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-6">Book Tickets</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Event Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
              <div className="relative h-[200px]">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h2 className="text-white text-xl font-bold">{event.title}</h2>
                  <p className="text-white/90 text-sm">
                    {format(new Date(event.date), "EEEE, MMMM d, yyyy • h:mm a")}
                  </p>
                  {venue && (
                    <p className="text-white/90 text-sm">
                      {venue.name}, {venue.city}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Seat Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Select Your Seats</h2>
              
              <div className="mb-6">
                <p className="text-sm text-neutral-500 mb-1">Available seats: {event.availableSeats}</p>
                <div className="flex items-center">
                  <label htmlFor="quantity" className="font-medium mr-4">Number of tickets:</label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={event.availableSeats}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20"
                  />
                </div>
              </div>
              
              {/* Selected Seats */}
              {selectedSeats.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Selected Seats:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(seat => (
                      <div key={seat} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        Seat {seat}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold p-4 border-b">Booking Summary</h2>
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">{event.title}</span>
                  <span className="font-medium">₹{event.price} x {quantity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tickets</span>
                  <span>{quantity}</span>
                </div>
                
                <div className="pt-4 border-t flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹{event.price * quantity}</span>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handleBooking}
                  disabled={createBookingMutation.isPending || quantity <= 0 || quantity > event.availableSeats}
                >
                  {createBookingMutation.isPending ? "Processing..." : "Confirm Booking"}
                </Button>
                
                <p className="text-xs text-center text-neutral-500 mt-2">
                  By confirming this booking, you agree to our terms & conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Booking;
