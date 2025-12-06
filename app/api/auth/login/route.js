/**
 * Login API Route
 * 
 * Verifies Firebase token and updates last login timestamp in the database.
 * Auto-creates user in database if they don't exist (for users who signed up
 * before database integration or if registration failed).
 * 
 * Requirements: 2.3
 */

import { getUserByFirebaseUid, updateLastLogin, createUser } from '../../../../lib/db/userRepository.js';
import { verifyRequest } from '../../../../lib/middleware/authMiddleware.js';

/**
 * POST /api/auth/login
 * 
 * Verifies Firebase token, updates last login timestamp, returns user data.
 * Creates user in database if they don't exist.
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

        // Get user from database
        let user = await getUserByFirebaseUid(decodedToken.uid);

        // If user doesn't exist in database, create them
        // This handles users who signed up before database integration
        if (!user) {
            try {
                user = await createUser({
                    firebaseUid: decodedToken.uid,
                    email: decodedToken.email,
                    displayName: decodedToken.name || null
                });
            } catch (createError) {
                console.error('Error creating user during login:', createError);
                return Response.json(
                    {
                        error: 'Internal Server Error',
                        message: 'Unable to create user record'
                    },
                    { status: 500 }
                );
            }
        }

        // Update last login timestamp
        await updateLastLogin(decodedToken.uid);

        // Fetch updated user data
        const updatedUser = await getUserByFirebaseUid(decodedToken.uid);

        return Response.json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error('Login error:', error);

        return Response.json(
            {
                error: 'Internal Server Error',
                message: 'Unable to process login'
            },
            { status: 500 }
        );
    }
}
