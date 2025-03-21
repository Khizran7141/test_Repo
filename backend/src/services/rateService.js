const rateLimitStore = new Map();
const MAX_REQUESTS = 5;
const WINDOW_SIZE_IN_MINUTES = 1;
const BLOCK_DURATION_IN_SECONDS = 60;

export const handleRateLimiting = (userIP) => {
    const now = Date.now();
    const windowStart = now - WINDOW_SIZE_IN_MINUTES * 60 * 1000;

    let userData = rateLimitStore.get(userIP);

    if (!userData) {
        userData = {
            requests: [],
            blockExpiresAt: null,
        };
    }

    if (userData.blockExpiresAt && userData.blockExpiresAt > now) {
        const remainingBlockTime = Math.ceil((userData.blockExpiresAt - now) / 1000);
        return {
            statusCode: 429,
            message: `Too many requests. Blocked for ${remainingBlockTime} more seconds.`,
            blockTimeRemaining: remainingBlockTime,
        };
    }

    // Remove expired requests from the window
    userData.requests = userData.requests.filter(
        (timestamp) => now - timestamp <= WINDOW_SIZE_IN_MINUTES * 60 * 1000
    );

    if (userData.requests.length >= MAX_REQUESTS) {
        userData.blockExpiresAt = now + BLOCK_DURATION_IN_SECONDS * 1000;
        rateLimitStore.set(userIP, userData);
        return {
            statusCode: 429,
            message: `Rate limit exceeded. You are blocked for ${BLOCK_DURATION_IN_SECONDS} seconds.`,
            blockTimeRemaining: BLOCK_DURATION_IN_SECONDS,
        };
    }

    // Log the new request
    userData.requests.push(now);
    rateLimitStore.set(userIP, userData);

    const remainingRequests = MAX_REQUESTS - userData.requests.length;

    return {
        statusCode: 200,
        remainingRequests,
        message: 'Pong!',
    };
};
