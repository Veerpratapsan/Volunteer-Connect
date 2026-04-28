"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    handleSuccess(res, data, statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            data
        });
    }
    handleError(error, res, context) {
        console.error(`[${context}] Error:`, error);
        // In a production app with Sentry, we would do:
        // Sentry.captureException(error);
        if (error instanceof Error) {
            if (error.message.includes('NOT_FOUND')) {
                res.status(404).json({ success: false, error: 'Resource not found' });
                return;
            }
            if (error.message.includes('FORBIDDEN')) {
                const msg = error.message.replace(/^FORBIDDEN:\s*/i, '').trim() || 'Forbidden';
                res.status(403).json({ success: false, error: msg });
                return;
            }
            res.status(400).json({ success: false, error: error.message });
            return;
        }
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
exports.BaseController = BaseController;
