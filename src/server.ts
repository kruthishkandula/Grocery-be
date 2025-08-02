import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { csrfProtection } from "./common/middleware";
import { MESSAGE_TYPES, STATUS_TYPES } from "./common/enums";
import job from "./config/cron";
import { ENV } from "./config/env";
import { routes } from "./routes/routes";

const app = express();
const PORT = ENV.PORT;

// Debug request middleware
app.use((req, res, next) => {
  console.log(`\n[DEBUG] Request: ${req.method} ${req.path}`);
  console.log(`[DEBUG] Headers:`, req.headers);
  console.log(`[DEBUG] Cookies:`, req.cookies, '\n');
  next();
});

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

if (ENV.NODE_ENV === "prod") {
  job.start();
}

const allowedOrigins = ['https://groceryadminportal.onrender.com', 'http://localhost:3000', 'http://localhost:3002','http://localhost:3001'];

// CORS middleware setup
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-TOKEN']
}));

// Apply CSRF protection to all routes
// app.use(csrfProtection);

// Logging
app.use(morgan("dev"));

// Routes setup
app.use("/api", routes);

app.get("/api/health", async (req: any, res: any) => {
  try {
    return res.status(200).json({
      status: STATUS_TYPES.SUCCESS,
      message: MESSAGE_TYPES.YOU_ARE_ON_SERVER,
      result: "",
    });
  } catch (error) {
    console.error("error", error);
    return res.status(500).json({
      status: STATUS_TYPES.FAILURE,
      message: MESSAGE_TYPES.INTERNAL_SERVER_ERROR,
      result: "",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
