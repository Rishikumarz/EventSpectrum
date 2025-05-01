import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRequireAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, MapPinIcon, TicketIcon, UserIcon, MailIcon, PhoneIcon, MapIcon, LockIcon } from "lucide-react";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  city: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const auth = useRequireAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [location, setLocation] = useLocation();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: auth.user?.name || "",
      email: auth.user?.email || "",
      phone: auth.user?.phone || "",
      city: auth.user?.city || "",
    },
  });
  
  // Get user's bookings
  const { data: bookings = [], isLoading: isBookingsLoading } = useQuery({
    queryKey: ['/api/bookings/user'],
    enabled: !!auth.user,
  });

  useEffect(() => {
    document.title = "My Profile - EventSpot";
    
    // Check if URL has a hash and set the active tab accordingly
    if (location.includes("#")) {
      const hash = location.split("#")[1];
      if (["bookings", "profile", "settings"].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, [location]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLocation(`/profile#${value}`, { replace: true });
  };
  
  const onSubmit = (data: ProfileFormValues) => {
    console.log("Profile update submitted:", data);
    // This would typically update the user profile via an API call
  };

  if (auth.isLoading) {
    return (
      <main className="pt-24 md:pt-16 pb-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 md:pt-16 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-6">My Profile</h1>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Personal Info</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* My Bookings Tab */}
          <TabsContent value="bookings">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Booking History</h2>
              
              {isBookingsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-32 w-full rounded-lg" />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <TicketIcon size={48} className="text-neutral-300" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Bookings Yet</h3>
                    <p className="text-neutral-500 mb-4">You haven't booked any events yet. Browse our events and book your first ticket!</p>
                    <Link href="/">
                      <Button>Browse Events</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/4 h-32 md:h-auto">
                          <img 
                            src={booking.event.image} 
                            alt={booking.event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:w-3/4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{booking.event.title}</h3>
                              <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <CalendarIcon size={12} />
                                  {format(new Date(booking.event.date), "MMM d, yyyy")}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <TicketIcon size={12} />
                                  {booking.numberOfSeats} {booking.numberOfSeats > 1 ? 'tickets' : 'ticket'}
                                </Badge>
                                <Badge 
                                  className={`${
                                    booking.status === 'confirmed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            <span className="font-bold">₹{booking.totalAmount}</span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-sm text-neutral-500">
                              Booked on {format(new Date(booking.bookingDate), "MMM d, yyyy")}
                            </div>
                            <Link href={`/events/${booking.eventId}`}>
                              <Button variant="outline" size="sm">View Event</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Personal Info Tab */}
          <TabsContent value="profile">
            <div className="md:grid md:grid-cols-3 gap-6">
              {/* User Details Card */}
              <div className="col-span-1 mb-6 md:mb-0">
                <Card>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      <Avatar className="w-20 h-20">
                        <AvatarFallback className="text-2xl bg-primary text-white">
                          {auth.user?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle>{auth.user?.name}</CardTitle>
                    <CardDescription>{auth.user?.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <UserIcon size={16} className="mr-2 text-neutral-500" />
                        <span>{auth.user?.username}</span>
                      </div>
                      <div className="flex items-center">
                        <MailIcon size={16} className="mr-2 text-neutral-500" />
                        <span>{auth.user?.email}</span>
                      </div>
                      {auth.user?.phone && (
                        <div className="flex items-center">
                          <PhoneIcon size={16} className="mr-2 text-neutral-500" />
                          <span>{auth.user?.phone}</span>
                        </div>
                      )}
                      {auth.user?.city && (
                        <div className="flex items-center">
                          <MapPinIcon size={16} className="mr-2 text-neutral-500" />
                          <span>{auth.user?.city}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Edit Profile Form */}
              <div className="col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Your email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Your city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="mt-2">Save Changes</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" placeholder="Enter your current password" />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" placeholder="Enter new password" />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                    </div>
                    
                    <Button>Change Password</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control how we communicate with you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-neutral-500">Receive emails about your bookings and events</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-notifications" className="w-4 h-4" checked />
                        <Label htmlFor="email-notifications" className="cursor-pointer">Enabled</Label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-neutral-500">Receive text messages about your bookings</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="sms-notifications" className="w-4 h-4" />
                        <Label htmlFor="sms-notifications" className="cursor-pointer">Disabled</Label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Communications</h4>
                        <p className="text-sm text-neutral-500">Receive updates about new events and offers</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="marketing-notifications" className="w-4 h-4" checked />
                        <Label htmlFor="marketing-notifications" className="cursor-pointer">Enabled</Label>
                      </div>
                    </div>
                    
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Delete Account</CardTitle>
                  <CardDescription>Permanently remove your account and data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-700 mb-4">
                    This action is irreversible and will permanently delete all your account data, including booking history.
                  </p>
                  <Button variant="destructive">Delete My Account</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Profile;
