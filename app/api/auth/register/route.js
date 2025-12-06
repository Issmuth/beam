/**
 * Register API Route
 * 
 * Creates a user record in the MySQL database after Firebase registration.
 * 
 * Requirements: 1.5
 */

import { createUser } from '../../../../lib/db/userRepository.js';
import { verifyRequest } from '../../../../lib/middleware/authMiddleware.js';

/**
 * POST /api/auth/register
 * 
 * Accepts Firebase UID and user data from client, creates user record in MySQL.
 * Requires a valid Firebase token in the Authorization header.
 */
export async function POST(request) {
    try {
        // Verify the Firebase token
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

        // Parse request body for additional user data
        const body = await request.json();
        const { displayName } = body;

        // Create user in database using Firebase UID and email from token
        const user = await createUser({
            firebaseUid: decodedToken.uid,
            email: decodedToken.email,
            displayName: displayName || decodedToken.name || null
        });

        return Response.json({
            success: true,
            user
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);

        return Response.json(
            {
                error: 'Internal Server Error',
                message: 'Unable to process registration'
            },
            { status: 500 }
        );
    }
}
