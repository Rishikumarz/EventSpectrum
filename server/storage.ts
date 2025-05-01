import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  venues, type Venue, type InsertVenue,
  artists, type Artist, type InsertArtist,
  events, type Event, type InsertEvent,
  bookings, type Booking, type InsertBooking
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Venue operations
  getVenues(): Promise<Venue[]>;
  getVenue(id: number): Promise<Venue | undefined>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  
  // Artist operations
  getArtists(): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  
  // Event operations
  getEvents(): Promise<Event[]>;
  getFeaturedEvents(): Promise<Event[]>;
  getTrendingEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  getEventsByCategory(categoryId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEventSeats(id: number, seatsBooked: number): Promise<Event | undefined>;
  
  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private venues: Map<number, Venue>;
  private artists: Map<number, Artist>;
  private events: Map<number, Event>;
  private bookings: Map<number, Booking>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private venueIdCounter: number;
  private artistIdCounter: number;
  private eventIdCounter: number;
  private bookingIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.venues = new Map();
    this.artists = new Map();
    this.events = new Map();
    this.bookings = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.venueIdCounter = 1;
    this.artistIdCounter = 1;
    this.eventIdCounter = 1;
    this.bookingIdCounter = 1;
    
    // Initialize with test data
    this.initializeTestData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Venue operations
  async getVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async createVenue(insertVenue: InsertVenue): Promise<Venue> {
    const id = this.venueIdCounter++;
    const venue: Venue = { ...insertVenue, id };
    this.venues.set(id, venue);
    return venue;
  }

  // Artist operations
  async getArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async createArtist(insertArtist: InsertArtist): Promise<Artist> {
    const id = this.artistIdCounter++;
    const artist: Artist = { ...insertArtist, id };
    this.artists.set(id, artist);
    return artist;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.isFeatured);
  }

  async getTrendingEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.isTrending);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventsByCategory(categoryId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      event => event.categoryId === categoryId
    );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }
  
  async updateEventSeats(id: number, seatsBooked: number): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const availableSeats = event.availableSeats - seatsBooked;
    if (availableSeats < 0) return undefined;
    
    const updatedEvent = { ...event, availableSeats };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.userId === userId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      bookingDate: new Date(),
      status: "confirmed"
    };
    this.bookings.set(id, booking);
    return booking;
  }
  
  // Initialize test data
  private initializeTestData() {
    // Create test user
    const testUser: InsertUser = {
      username: "testuser",
      password: "password123",
      name: "Test User",
      email: "test@example.com",
      phone: "9876543210",
      city: "Delhi"
    };
    this.createUser(testUser);
    
    // Create categories
    const categories: InsertCategory[] = [
      { name: "Concerts", icon: "fa-music", color: "primary" },
      { name: "Theatre", icon: "fa-theater-masks", color: "secondary" },
      { name: "Comedy", icon: "fa-laugh-beam", color: "accent" },
      { name: "Cultural", icon: "fa-om", color: "green" },
      { name: "Tech Fest", icon: "fa-robot", color: "purple" },
      { name: "Food Fests", icon: "fa-utensils", color: "blue" },
      { name: "Film Festivals", icon: "fa-film", color: "red" }
    ];
    
    categories.forEach(category => this.createCategory(category));
    
    // Create venues
    const venues: InsertVenue[] = [
      { 
        name: "Siri Fort Auditorium", 
        address: "August Kranti Marg", 
        city: "Delhi", 
        state: "Delhi", 
        capacity: 2000, 
        image: "https://images.unsplash.com/photo-1578944032637-f09897c5233d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
      },
      { 
        name: "JLN Stadium", 
        address: "Pragati Vihar", 
        city: "Delhi", 
        state: "Delhi", 
        capacity: 60000, 
        image: "https://images.unsplash.com/photo-1606639421367-95576aa1c747?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
      },
      { 
        name: "NCPA", 
        address: "Nariman Point", 
        city: "Mumbai", 
        state: "Maharashtra", 
        capacity: 1200, 
        image: "https://images.unsplash.com/photo-1608234807905-4466023792f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
      },
      { 
        name: "Kamani Auditorium", 
        address: "Copernicus Marg", 
        city: "Delhi", 
        state: "Delhi", 
        capacity: 750, 
        image: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
      },
      { 
        name: "Phoenix Marketcity", 
        address: "Whitefield", 
        city: "Mumbai", 
        state: "Maharashtra", 
        capacity: 5000, 
        image: "https://images.unsplash.com/photo-1624293258267-959a7ed72a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
      },
      { 
        name: "Habitat Centre", 
        address: "Lodhi Road", 
        city: "Delhi", 
        state: "Delhi", 
        capacity: 1000, 
        image: "https://images.unsplash.com/photo-1572844986430-997270651e8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
      }
    ];
    
    venues.forEach(venue => this.createVenue(venue));
    
    // Create artists
    const artists: InsertArtist[] = [
      { 
        name: "Arijit Singh", 
        type: "Musician", 
        image: "https://images.unsplash.com/photo-1593697972646-2f348871bd56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bio: "Popular Bollywood playback singer"
      },
      { 
        name: "Zakir Hussain", 
        type: "Tabla Maestro", 
        image: "https://images.unsplash.com/photo-1616559051446-a19f04b52de6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bio: "World-renowned tabla player and composer"
      },
      { 
        name: "Vir Das", 
        type: "Comedian", 
        image: "https://images.unsplash.com/photo-1527697911937-ffd76b048f15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bio: "Indian comedian, actor and musician"
      },
      { 
        name: "A.R. Rahman", 
        type: "Composer", 
        image: "https://images.unsplash.com/photo-1508674861872-a51e06c50c9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bio: "Oscar-winning composer and music producer"
      },
      { 
        name: "Shreya Ghoshal", 
        type: "Singer", 
        image: "https://images.unsplash.com/photo-1565116175827-64847f972a3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bio: "Popular female playback singer"
      },
      { 
        name: "Kanan Gill", 
        type: "Comedian", 
        image: "https://images.unsplash.com/photo-1533551445-66165599e97c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bio: "Stand-up comedian and YouTuber"
      }
    ];
    
    artists.forEach(artist => this.createArtist(artist));
    
    // Create events
    const events: InsertEvent[] = [
      {
        title: "Navratri Festival 2023",
        description: "Experience the colors and music of India's most vibrant festival",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        date: new Date("2023-10-15"),
        price: 1000,
        venueId: 2,
        categoryId: 4,
        artistId: null,
        isFeatured: true,
        isTrending: false,
        totalSeats: 5000,
        availableSeats: 3500
      },
      {
        title: "Comedy Nights with Vir Das",
        description: "An evening of laughter and wit with India's top comedian",
        image: "https://images.unsplash.com/photo-1592213299587-7bbb135c541d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        date: new Date("2023-09-28"),
        price: 800,
        venueId: 1,
        categoryId: 3,
        artistId: 3,
        isFeatured: true,
        isTrending: false,
        totalSeats: 500,
        availableSeats: 200
      },
      {
        title: "Arijit Singh Live in Concert",
        description: "Experience the magical voice of Bollywood's favorite singer",
        image: "https://images.unsplash.com/photo-1601124178830-70b4bece5b71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        date: new Date("2023-11-12"),
        price: 2500,
        venueId: 2,
        categoryId: 1,
        artistId: 1,
        isFeatured: true,
        isTrending: true,
        totalSeats: 10000,
        availableSeats: 5000
      },
      {
        title: "Sunburn Music Festival",
        description: "India's premier electronic dance music festival",
        image: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        date: new Date("2023-12-28"),
        price: 1999,
        venueId: 2,
        categoryId: 1,
        artistId: null,
        isFeatured: false,
        isTrending: true,
        totalSeats: 20000,
        availableSeats: 15000
      },
      {
        title: "Rahman Live in Concert",
        description: "Musical evening with the Mozart of Madras",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        date: new Date("2023-10-15"),
        price: 2500,
        venueId: 2,
        categoryId: 1,
        artistId: 4,
        isFeatured: false,
        isTrending: true,
        totalSeats: 5000,
        availableSeats: 1500
      },
      {
        title: "Zakir Hussain - Masters of Percussion",
        description: "A mesmerizing evening of Indian classical music",
        image: "https://images.unsplash.com/photo-1508997449629-303059a039c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        date: new Date("2023-11-05"),
        price: 1800,
        venueId: 3,
        categoryId: 1,
        artistId: 2,
        isFeatured: false,
        isTrending: true,
        totalSeats: 1000,
        availableSeats: 300
      },
      {
        title: "The Comedy Factory",
        description: "An evening of laughter with top Indian comedians",
        image: "https://images.unsplash.com/photo-1425421669292-0c3da3b8f529?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        date: new Date("2023-10-22"),
        price: 799,
        venueId: 6,
        categoryId: 3,
        artistId: 6,
        isFeatured: false,
        isTrending: true,
        totalSeats: 500,
        availableSeats: 100
      }
    ];
    
    events.forEach(event => this.createEvent(event));
  }
}

export const storage = new MemStorage();
