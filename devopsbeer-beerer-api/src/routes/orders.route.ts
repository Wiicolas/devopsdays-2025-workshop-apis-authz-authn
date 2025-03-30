import { randomUUID } from "crypto";
import { Request, Response, Router } from "express";
import { JSONFilePreset } from "lowdb/node";
import OrderUpdate from "src/models/order-update.js";
import requireScope from "../middlewares/require-scope.js";
import Error from "../models/error.js";
import OrderCreate from "../models/order-create.js";
import { OrderStatus } from "../models/order-status.enum.js";
import Order from "../models/order.js";
import { ForbiddenResponse, NotFoundResponse } from "../utils.js";

const router = Router();

const db = await JSONFilePreset<{ orders: Order[] }>('orders.db.json', { orders: [] });


router.get('', requireScope("Orders.Read.All"), async (req: Request, res: Response) => {
    await db.read();
    const orders: Order[] = db.data.orders;

    res.status(200).json(
        {
            data: orders,
            total: orders.length
        }
    );
})


router.post('', requireScope("Orders.Write"), async (req: Request, res: Response) => {
    const currentUser = req.authInfo!; // The authenticated user from passport
    const isAdmin = currentUser.roles && currentUser.roles.includes('admin');

    if (!isAdmin) {
        const error: Error = ForbiddenResponse();
        res.status(error.code).json(error);
        return;
    }

    const body: OrderCreate = req.body as OrderCreate;
    const order: Order = { ...body, createdDate: (new Date()), id: randomUUID(), status: "CREATED" };
    await db.update(({ orders }) => orders.push(order));
    res.status(200).json(order);
})

router.get('/:id', requireScope("Orders.Read"), async (req: Request, res: Response) => {
    const params = req.params;
    const id: string = params["id"];

    await db.read();

    const order: Order | undefined = db.data.orders.find(order => order.id === id);

    if (!order) {
        const error: Error = NotFoundResponse();
        res.status(error.code).json(error);
        return;
    }

    res.status(200).json(order);
})

router.patch('/:id', requireScope("Orders.Write"), async (req: Request, res: Response) => {
    const params = req.params;
    const id: string = params["id"];
    const currentUser = req.authInfo!; // The authenticated user from passport

    await db.read();
    const orderIndex = db.data.orders.findIndex(order => order.id === id);

    if (orderIndex === -1) {
        const error: Error = NotFoundResponse();
        res.status(error.code).json(error);
        return;
    }

    // Check if user is admin or the original author
    const isAdmin = currentUser.roles && currentUser.roles.includes('admin');

    if (!isAdmin) {
        const error: Error = ForbiddenResponse();
        res.status(error.code).json(error);
        return;
    }

    const body: OrderUpdate = req.body as OrderUpdate;
    console.log("Body", body);

    const updatedOrder: Order = {
        ...db.data.orders[orderIndex],
        ...body
    };

    console.log("updatedOrder", updatedOrder);


    db.data.orders[orderIndex] = updatedOrder;
    await db.write();

    res.status(200).send(updatedOrder);
})

router.delete('/:id', requireScope("Orders.Write"), async (req: Request, res: Response) => {
    const params = req.params;
    const id: string = params["id"];
    const currentUser = req.authInfo!; // The authenticated user from passport

    await db.read();

    const order = db.data.orders.find(order => order.id === id);

    if (!order) {
        const error: Error = NotFoundResponse();
        res.status(error.code).json(error);
        return;
    }

    // Check if user is admin or the original author
    const isAdmin = currentUser.roles && currentUser.roles.includes('admin');

    if (!isAdmin) {
        const error: Error = ForbiddenResponse();
        res.status(error.code).json(error);
        return;
    }

    db.data.orders = db.data.orders.filter(order => order.id !== id);

    await db.write();

    res.status(204).send();
})

export default router;