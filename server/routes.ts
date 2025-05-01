import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

// Middleware for checking authentication
const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Set up session storage
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      secret: "eventspot-session-secret",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // 24 hours
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    })
  );
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  
  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Authentication routes
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as any;
    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city
    };
    res.json({ user: safeUser });
  });
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userSchema = z.object({
        username: z.string().min(3),
        password: z.string().min(6),
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        city: z.string().optional()
      });
      
      const userData = userSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Log in the user after registration
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        
        const safeUser = {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          city: newUser.city
        };
        
        return res.status(201).json({ user: safeUser });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error during registration" });
    }
  });
  
  app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      const safeUser = {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city
      };
      return res.json({ isAuthenticated: true, user: safeUser });
    }
    res.json({ isAuthenticated: false });
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // User profile routes
  app.get("/api/users/profile", requireAuth, (req, res) => {
    const user = req.user as any;
    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city
    };
    res.json(safeUser);
  });
  
  // Category routes
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });
  
  // Venue routes
  app.get("/api/venues", async (req, res) => {
    const venues = await storage.getVenues();
    res.json(venues);
  });
  
  app.get("/api/venues/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid venue ID" });
    }
    
    const venue = await storage.getVenue(id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    
    res.json(venue);
  });
  
  // Artist routes
  app.get("/api/artists", async (req, res) => {
    const artists = await storage.getArtists();
    res.json(artists);
  });
  
  app.get("/api/artists/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid artist ID" });
    }
    
    const artist = await storage.getArtist(id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    
    res.json(artist);
  });
  
  // Event routes
  app.get("/api/events", async (req, res) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    
    if (categoryId) {
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const events = await storage.getEventsByCategory(categoryId);
      return res.json(events);
    }
    
    const events = await storage.getEvents();
    res.json(events);
  });
  
  app.get("/api/events/featured", async (req, res) => {
    const events = await storage.getFeaturedEvents();
    res.json(events);
  });
  
  app.get("/api/events/trending", async (req, res) => {
    const events = await storage.getTrendingEvents();
    res.json(events);
  });
  
  app.get("/api/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    
    const event = await storage.getEvent(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event);
  });
  
  // Booking routes
  app.post("/api/bookings", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      
      const bookingSchema = z.object({
        eventId: z.number(),
        numberOfSeats: z.number().min(1),
        seatNumbers: z.array(z.number())
      });
      
      const bookingData = bookingSchema.parse(req.body);
      
      // Get event details
      const event = await storage.getEvent(bookingData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Check if enough seats are available
      if (event.availableSeats < bookingData.numberOfSeats) {
        return res.status(400).json({ message: "Not enough seats available" });
      }
      
      // Calculate total amount
      const totalAmount = event.price * bookingData.numberOfSeats;
      
      // Create booking
      const booking = await storage.createBooking({
        userId: user.id,
        eventId: bookingData.eventId,
        numberOfSeats: bookingData.numberOfSeats,
        totalAmount,
        seatNumbers: bookingData.seatNumbers
      });
      
      // Update available seats
      await storage.updateEventSeats(bookingData.eventId, bookingData.numberOfSeats);
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error during booking creation" });
    }
  });
  
  app.get("/api/bookings/user", requireAuth, async (req, res) => {
    const user = req.user as any;
    const bookings = await storage.getUserBookings(user.id);
    
    // Fetch event details for each booking
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const event = await storage.getEvent(booking.eventId);
        return {
          ...booking,
          event
        };
      })
    );
    
    res.json(bookingsWithDetails);
  });
  
  return httpServer;
}
