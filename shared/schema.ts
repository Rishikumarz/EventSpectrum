import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  city: text("city"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  phone: true,
  city: true,
});

// Category Model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  color: true,
});

// Venue Model
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  capacity: integer("capacity").notNull(),
  image: text("image").notNull(),
});

export const insertVenueSchema = createInsertSchema(venues).pick({
  name: true,
  address: true,
  city: true,
  state: true,
  capacity: true,
  image: true,
});

// Artist Model
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  image: text("image").notNull(),
  bio: text("bio"),
});

export const insertArtistSchema = createInsertSchema(artists).pick({
  name: true,
  type: true,
  image: true,
  bio: true,
});

// Event Model
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  date: timestamp("date").notNull(),
  price: integer("price").notNull(),
  venueId: integer("venue_id").notNull(),
  categoryId: integer("category_id").notNull(),
  artistId: integer("artist_id"),
  isFeatured: boolean("is_featured").default(false),
  isTrending: boolean("is_trending").default(false),
  totalSeats: integer("total_seats").notNull(),
  availableSeats: integer("available_seats").notNull(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  image: true,
  date: true,
  price: true,
  venueId: true,
  categoryId: true,
  artistId: true,
  isFeatured: true,
  isTrending: true,
  totalSeats: true,
  availableSeats: true,
});

// Booking Model
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  eventId: integer("event_id").notNull(),
  bookingDate: timestamp("booking_date").defaultNow().notNull(),
  numberOfSeats: integer("number_of_seats").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("confirmed"),
  seatNumbers: jsonb("seat_numbers").notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  eventId: true,
  numberOfSeats: true,
  totalAmount: true,
  seatNumbers: true,
});

// Exported Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
