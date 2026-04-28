"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const unifiedConfig_1 = require("../config/unifiedConfig");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token' });
            return;
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await unifiedConfig_1.auth.verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
        };
        next();
    }
    catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ success: false, error: 'Unauthorized: Token verification failed' });
        return;
    }
};
exports.requireAuth = requireAuth;
