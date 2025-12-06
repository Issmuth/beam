import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getFirebaseAdmin() {
    if (getApps().length === 0) {
        const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
        );

        initializeApp({
            credential: cert(serviceAccount),
        });
    }

    return getAuth();
}

/**
 * Verifies a Firebase ID token and returns the decoded token
 * @param {string} token - The Firebase ID token to verify
 * @returns {Promise<import('firebase-admin/auth').DecodedIdToken>}
 */
export async function verifyIdToken(token) {
    const auth = getFirebaseAdmin();
    return auth.verifyIdToken(token);
}

/**
 * Gets a user by their UID
 * @param {string} uid - The user's Firebase UID
 * @returns {Promise<import('firebase-admin/auth').UserRecord>}
 */
export async function getUser(uid) {
    const auth = getFirebaseAdmin();
    return auth.getUser(uid);
}

export { getFirebaseAdmin };
