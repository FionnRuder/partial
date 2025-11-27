import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
/* ROUTE IMPORTS */
import milestoneRoutes from "./routes/milestoneRoutes";
import partRoutes from "./routes/partRoutes";
import programRoutes from "./routes/programRoutes";
import searchRoutes from "./routes/searchRoutes";
import teamRoutes from "./routes/teamRoutes";
import userRoutes from "./routes/userRoutes";
import workItemRoutes from "./routes/workItemRoutes";
import onboardingRoutes from "./routes/onboardingRoutes";
import authRoutes from "./routes/authRoutes";
import invitationRoutes from "./routes/invitationRoutes";
import deliverableTypeRoutes from "./routes/deliverableTypeRoutes";
import issueTypeRoutes from "./routes/issueTypeRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import healthRoutes from "./routes/healthRoutes";
import { authenticate } from "./middleware/authenticate";
import { initializeCognitoClient } from "./lib/cognitoClient";
import {
  ipRateLimiter,
  userRateLimiter,
  authRateLimiter,
  publicEndpointRateLimiter,
} from "./middleware/rateLimiter";


/* CONFIGURATIONS */
dotenv.config();
const app = express();

// Session configuration
// Determine if we're in production based on NODE_ENV or if FRONTEND_URL uses HTTPS
const isProduction = process.env.NODE_ENV === 'production' || 
                     (process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith('https://'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'some secret - change this in production',
  name: 'connect.sid', // Explicit session cookie name
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction ? true : false, // Use secure cookies in production (HTTPS only)
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict', // Allow cross-site cookies in production if needed
    path: '/', // Ensure cookie is available for all paths
  },
}));

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent with requests
}));

// Trust proxy for accurate IP addresses (important for rate limiting behind proxies/load balancers)
app.set('trust proxy', 1);

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

// Health check routes (public, no authentication required, no rate limiting)
// These should be accessible without restrictions for monitoring systems
app.use(healthRoutes);

// Apply global IP rate limiting to all other routes
app.use(ipRateLimiter);

// Authentication routes with stricter rate limiting
app.use("/auth", authRateLimiter, authRoutes);

// Onboarding routes (require Cognito session but user may not exist in DB yet)
// Apply public endpoint rate limiting (similar to invitations)
app.use("/onboarding", publicEndpointRateLimiter, onboardingRoutes);

// Invitation routes - some public (validate), some require auth (handled in route file)
// Public endpoint rate limiting applied to all invitation routes (validates endpoint handles it)
app.use("/invitations", publicEndpointRateLimiter, invitationRoutes);

// All other routes require authentication and user-based rate limiting
app.use(authenticate);
app.use(userRateLimiter);

app.use("/milestones", milestoneRoutes);
app.use("/parts", partRoutes);
app.use("/programs", programRoutes);
app.use("/search", searchRoutes);
app.use("/teams", teamRoutes);
app.use("/users", userRoutes);
app.use("/workItems", workItemRoutes);
app.use("/deliverableTypes", deliverableTypeRoutes);
app.use("/issueTypes", issueTypeRoutes);
app.use("/feedback", feedbackRoutes);
// Note: /invitations routes are above the authenticate middleware
// Some routes are public (validate), others require auth (create, get, revoke)

/* 404 HANDLER (must come after routes) */
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

/* ERROR HANDLING MIDDLEWARE (must come last) */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* SERVER */
const port = Number(process.env.PORT) || 3000;

// Initialize Cognito client before starting server
initializeCognitoClient()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize Cognito client:", error);
    console.error("Server will still start, but authentication may not work properly.");
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port} (Cognito not initialized)`);
    });
  });
