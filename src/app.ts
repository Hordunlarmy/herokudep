

import express, { Request, Response } from "express";
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import session from 'express-session';
import { limiter } from "./middlewares/rateLimiter";
import { useCors } from "./middlewares/cors";
import { ipWhitelist } from "./middlewares/ipWhitelist";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Security and compression middlewares
app.set('port', process.env.PORT || 3001);
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Lusca for enhanced security
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(session({
     secret: 'secretKey',
     resave: false,
     saveUninitialized: true
   }));
   app.use(lusca.csrf());

// Static files
app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: '1y' })
);

// Custom middleware for CORS and IP whitelisting
app.use(limiter);
app.use(useCors); 
// app.use(ipWhitelist);

app.get("/", (req: Request, res: Response) => {
  res.send("server is healthy");
});

app.get("/health", (req: Request, res: Response) => {
  res.send("server is healthy 2");
});

// Routing
// app.use('/users', userRouter);
// app.use('/posts', postRouter);

// Global error handling middleware
app.use(errorHandler);

export default app;

