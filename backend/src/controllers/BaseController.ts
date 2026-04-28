import { Response } from 'express';

export abstract class BaseController {
  
  protected handleSuccess(res: Response, data: any, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      data
    });
  }

  protected handleError(error: unknown, res: Response, context: string): void {
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
