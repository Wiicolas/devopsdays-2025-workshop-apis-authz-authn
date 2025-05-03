import { NextFunction, Request, Response } from "express";

const requireRole = (roleName?: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        next();
    };
};



export default requireRole;