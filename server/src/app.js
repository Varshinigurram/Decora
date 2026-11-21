import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { generalLimiter } from './middleware/rateLimitMiddleware.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import apiRouter from './routes/index.js';

const app = express();

// 1. HTTP Security Headers via Helmet
app.use(helmet());

// 2. Strict Cross-Origin Resource Sharing (CORS) Configuration
// NOTE: Browser specifications strictly forbid wildcard ('*') origins when credentials: true is set.
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like server-to-server or curl)
    if (!origin || origin === env.CLIENT_URL) {
      callback(null, true);
    } else {
      // Do not reflect Access-Control-Allow-Origin for unauthorized origins
      callback(null, false);
    }
  },
  credentials: true, // Required for Axios withCredentials: true (HTTP-only session cookies)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// 3. Request Body Parsers (Sensible 2MB Limit)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 4. Cookie Parser
// NOTE: In the authentication stage, cookie-based sessions will require an explicit CSRF
// mitigation strategy (SameSite=Lax enforcement + custom request header validation).
app.use(cookieParser());

// 5. Global Rate Limiter
app.use(generalLimiter);

// 6. Base Root Route (Informational)
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Décora Architectural Interior Design Platform API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    status: 'ONLINE',
  });
});

// 7. Mount Centralized Versioned API Router
app.use('/api/v1', apiRouter);

// 8. 404 Catch-All Middleware
app.use(notFoundHandler);

// 9. Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
