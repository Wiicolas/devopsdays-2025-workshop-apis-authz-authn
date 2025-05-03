import cors from 'cors';
import dotenv from "dotenv";
import express, { Express } from "express";
import morgan from 'morgan';
import passport from 'passport';
import beers from './routes/beers.route.js';
import orders from './routes/orders.route.js';

dotenv.config()

const app: Express = express()

// Initialize Express application
app.use(express.json());
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        cors()(req, res, next);
    } else {
        next();
    }
});
app.use(morgan('dev'));
app.use(passport.initialize());

// Health check endpoints for Kubernetes
app.get('/health/liveness', (req: any, res: any) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/health/readiness', async (req: any, res: any) => {
    try {
        res.status(200).json({ status: 'ready' });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(503).json({ status: 'not ready', error: errorMessage });
    }
});

// Declare routes
app.use('/v1.0.0/doc', express.static('./openapi.yaml'));
app.use("/v1.0.0/beers", beers)
app.use("/v1.0.0/orders", orders)

app.use((err: any, req: any, res: any, next: any) => {
    return res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message: err.message || 'An unexpected error occurred'
    });
});

app.listen((process.env.PORT || 3000) as number, '0.0.0.0', () => { console.log(`Server is running on port ${process.env.PORT || 3000}`) })
