import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";
import { storage, seedDatabase } from "./storage";
import { sql } from "drizzle-orm";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Push the schema to the database
    log("Pushing schema to database...");
    
    // Use drizzle-orm/neon-serverless/migrator to automatically push our schema to the database
    // We'll check if tables exist first to avoid re-creating them
    try {
      const tableExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'users'
        );
      `);
      
      if (!tableExists.rows.length || !tableExists.rows[0][0]) {
        log("Creating database tables...");
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            city TEXT
          );
        `);
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            icon TEXT NOT NULL,
            color TEXT NOT NULL
          );
        `);
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS venues (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            capacity INTEGER NOT NULL,
            image TEXT NOT NULL
          );
        `);
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS artists (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            image TEXT NOT NULL,
            bio TEXT
          );
        `);
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            image TEXT NOT NULL,
            date TIMESTAMP NOT NULL,
            price INTEGER NOT NULL,
            venue_id INTEGER NOT NULL REFERENCES venues(id),
            category_id INTEGER NOT NULL REFERENCES categories(id),
            artist_id INTEGER REFERENCES artists(id),
            is_featured BOOLEAN DEFAULT FALSE,
            is_trending BOOLEAN DEFAULT FALSE,
            total_seats INTEGER NOT NULL,
            available_seats INTEGER NOT NULL
          );
        `);
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            event_id INTEGER NOT NULL REFERENCES events(id),
            booking_date TIMESTAMP NOT NULL DEFAULT NOW(),
            number_of_seats INTEGER NOT NULL,
            total_amount INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'confirmed',
            seat_numbers JSONB NOT NULL
          );
        `);
        
        // After creating tables, seed the database
        log("Seeding database with initial data...");
        await seedDatabase(storage);
      } else {
        log("Database tables already exist, skipping creation.");
      }
    } catch (error: any) {
      log("Error creating/checking database tables: " + error.message);
      console.error("Database initialization error:", error);
    }
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (error: any) {
    console.error("Server initialization error:", error);
    process.exit(1);
  }
})();
