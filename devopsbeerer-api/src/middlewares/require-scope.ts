import { NextFunction, Request, Response } from "express";

const requireScope = (scopeName?: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        next();
    };
};



export default requireScope;