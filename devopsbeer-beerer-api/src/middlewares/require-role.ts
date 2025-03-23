import { NextFunction, Request, Response } from "express";

const requireRole = (roleName?: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.authInfo) {
            res.status(401).json({ 'message': 'Authentication information missing' });
            return;
        }

        if (!roleName) {
            next();
            return;
        }

        const roles: string[] = req.authInfo.roles || [];

        if (!roles.includes(roleName)) {
            res.status(403).json({ 'message': `Access forbidden: missing ${roleName} role` });
            return;
        }

        next();
    };
};



export default requireRole;