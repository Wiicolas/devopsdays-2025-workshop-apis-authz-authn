import { Request, Response, Router } from "express";
import { JSONFilePreset } from 'lowdb/node';
import passport from 'passport';
import requireScope from "../middlewares/require-scope.js";
import Beer from "../models/beer.js";
import BeerCreate from "src/models/beer-create.js";
import { randomUUID } from "crypto";

const router = Router();
const db = await JSONFilePreset<{ beers: Beer[] }>('db.json', { beers: [] });

router.use(passport.authenticate('oauth-bearer', { session: false }));

router.get('', requireScope("Beers.Read.All"), async (req: Request, res: Response) => {
    const isAvailableFiltering: string | undefined = req.query.isAvailable as string | undefined

    await db.read();
    const beers: Beer[] = db.data.beers;
    const beersFiltered: Beer[] = beers.filter(beer => isAvailableFiltering === undefined ? true : (isAvailableFiltering === "true" ? beer.quantity > 0 : beer.quantity === 0));

    res.status(200).json(
        {
            data: beersFiltered,
            total: beersFiltered.length
        }
    );
})

router.post('', requireScope("Beers.Write"), async (req: Request, res: Response) => {
    const currentUser = req.authInfo!; // The authenticated user from passport
    const isAdmin = currentUser.roles && currentUser.roles.includes('Admin');

    if (!isAdmin) {
        res.status(403).json({ "message": "Only administrators can add a beer" });
        return;
    }

    const body: BeerCreate = req.body as BeerCreate;
    const beer: Beer = { ...body, createdDate: (new Date()), updatedDate: new Date(), id: randomUUID() };
    await db.update(({ beers }) => beers.push(beer));
    res.status(200).json(beer);
})

router.get('/:id', requireScope("Beers.Read"), async (req: Request, res: Response) => {
    const params = req.params;
    const id: string = params["id"];

    await db.read();

    const beer: Beer | undefined = db.data.beers.find(beer => beer.id === id);

    if (!beer) {
        res.status(404).json({ "message": "Beer not found" });
        return;
    }

    res.status(200).json(beer);
})

router.delete('/:id', requireScope("Beers.Write"), async (req: Request, res: Response) => {
    const params = req.params;
    const id: string = params["id"];
    const currentUser = req.authInfo!; // The authenticated user from passport

    await db.read();

    const beer = db.data.beers.find(beer => beer.id === id);

    if (!beer) {
        res.status(404).json({ "message": "Beer not found" });
        return;
    }

    // Check if user is admin or the original author
    const isAdmin = currentUser.roles && currentUser.roles.includes('Admin');

    if (!isAdmin) {
        res.status(403).json({ "message": "Only administrators can delete this beer" });
        return;
    }

    db.data.beers = db.data.beers.filter(beer => beer.id !== id);

    await db.write();

    res.status(204).send();
})

export default router;