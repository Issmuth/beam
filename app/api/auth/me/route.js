/**
 * Me API Route
 * 
 * Protected route that returns the current user's profile from the database.
 * 
 * Requirements: 5.2
 */

import { getUserByFirebaseUid } from '../../../../lib/db/userRepository.js';
import { withAuth } from '../../../../lib/middleware/authMiddleware.js';

/**
 * GET /api/auth/me
 * 
 * Protected route - requires valid Firebase token.
 * Returns current user profile from database.
 */
async function handler(request) {
    try {
        // User is attached to request by withAuth middleware
        const decodedToken = request.user;

        // Get user from database
        const user = await getUserByFirebaseUid(decodedToken.uid);

        if (!user) {
            return Response.json(
                {
                    error: 'Not Found',
                    message: 'User not found'
                },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Get user error:', error);

        return Response.json(
            {
                error: 'Internal Server Error',
                message: 'Unable to retrieve user profile'
            },
            { status: 500 }
        );
    }
}

export const GET = withAuth(handler);
