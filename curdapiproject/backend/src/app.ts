import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';
import winston from 'winston';

// environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS
app.use(cors({
    origin: 'http://localhost:5173',  // frontend URL REQ
    credentials: true,                // Enable credentials (cookies/auth tokens)
}));

// Logger setup using Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// MongoDB conn
mongoose.connect(process.env.MONGO_URI as string || '')
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
        logger.error('MongoDB Connection Error: ', err);
        console.error(err);
    });

// Routes
app.use('/api', routes);

// error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Logs detailed error stack to console
  res.status(500).json({ message: 'Server error', error: err.message });
});


// Server
app.listen(port, () => console.log(`Server running on port ${port}`));
