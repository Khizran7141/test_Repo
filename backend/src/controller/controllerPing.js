import { handleRateLimiting } from '../services/rateService.js';

export const pingHandler = async (req, res) => {
    try {
        const { remainingRequests, blockTimeRemaining, message, statusCode } = await handleRateLimiting(req.ip);

        if (statusCode === 429) {
            res.setHeader('X-RateLimit-Remaining', 0);
            return res.status(statusCode).json({
                message,
                blockTimeRemaining,
            });
        }

        res.setHeader('X-RateLimit-Remaining', remainingRequests);
        res.json({
            message: 'Pong!',
            remainingRequests,
        });
    } catch (error) {
        console.error('Error in pingHandler:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
