import { NextFunction, Request, Response } from "express";

const requireScope = (scopeName?: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.authInfo) {
            res.status(401).json({ 'message': 'Authentication information missing' });
            return;
        }

        if (!scopeName) {
            next();
            return;
        }

        const scopeString = req.authInfo.scp || req.authInfo.scope || '';
        const scopes = typeof scopeString === 'string' ? scopeString.split(' ') : [];

        if (!scopes.includes(scopeName)) {
            res.status(403).json({ 'message': `Access forbidden: missing ${scopeName} scope` });
            return;
        }

        next();
    };
};



export default requireScope;