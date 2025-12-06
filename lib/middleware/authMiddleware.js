import { verifyIdToken } from '../firebase/admin.js';

/**
 * Extracts the Bearer token from the Authorization header
 * @param {Request} request - The incoming request
 * @returns {string|null} - The token or null if not found
 */
function extractBearerToken(request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
}

/**
 * Verifies the request and extracts the decoded token
 * @param {Request} request - The incoming request
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken|null>} - The decoded token or null
 */
export async function verifyRequest(request) {
    const token = extractBearerToken(request);
    if (!token) {
        return null;
    }

    try {
        const decodedToken = await verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        // Token verification failed (invalid, expired, etc.)
        return null;
    }
}

/**
 * Higher-order function that wraps an API route handler with authentication
 * @param {Function} handler - The API route handler function
 * @returns {Function} - The wrapped handler that requires authentication
 */
export function withAuth(handler) {
    return async function authenticatedHandler(request, context) {
        const decodedToken = await verifyRequest(request);

        if (!decodedToken) {
            return Response.json(
                {
                    error: 'Unauthorized',
                    message: 'Invalid or missing authentication token'
                },
                { status: 401 }
            );
        }

        // Attach the decoded token to the request for use in the handler
        request.user = decodedToken;

        return handler(request, context);
    };
}
