import express, { Express } from "express";
import morgan from 'morgan';
import passport from 'passport';
import KeycloakBearerStrategy from 'passport-keycloak-bearer';
import beers from './routes/beers.route.js';
import { UnauthorizedResponse } from "./utils.js";
import Error from "./models/error.js";

const kcStrategy: KeycloakBearerStrategy = new KeycloakBearerStrategy({
    url: process.env.KEYCLOAK_URL!,
    realm: process.env.KEYCLOAK_REALM || 'devopsbeerer',
    audience: process.env.KEYCLOAK_AUDIENCE
}, (jwtPayload, done) => {
    return done(null, jwtPayload, jwtPayload);
});

const app: Express = express()

// Initialize Express application
app.use(express.json());
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(morgan('dev'));
app.use(passport.initialize());
passport.use(kcStrategy);


// Declare routes
app.use('/v1.0.0/doc', express.static('./openapi.yaml'));
app.use("/v1.0.0/beers", passport.authenticate('keycloak', { session: false, failWithError: true }), beers)

app.use((err: any, req: any, res: any, next: any) => {
    if (err.name === 'AuthenticationError') {
        const error: Error = UnauthorizedResponse();
        return res.status(error.code).json(error);
    }

    return res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message: err.message || 'An unexpected error occurred'
    });
});

app.listen(process.env.PORT || 3000, () => { console.log(`Server is running on port ${process.env.PORT || 3000}`) })
