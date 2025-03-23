import express, { Express } from "express";
import morgan from 'morgan';
import passport from 'passport';
import passportazuread, { IBearerStrategyOption } from 'passport-azure-ad';
import beers from './routes/beers.route.js';

const options: IBearerStrategyOption = {
    identityMetadata: process.env.IDENTITY_METADATA!,
    clientID: process.env.AUDIENCE!,
    audience: process.env.AUDIENCE!,
    isB2C: false,
    validateIssuer: true
}

const bearerStrategy = new passportazuread.BearerStrategy(options, (token, done) => done(null, {}, token));

const app: Express = express()

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/doc', express.static('./openapi.yaml'));
app.use("/v1.0.0/beers", beers)

passport.use(bearerStrategy);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);

})
