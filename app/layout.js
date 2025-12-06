import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

export const metadata = {
    title: "Beam - AI Learning Roadmap Generator",
    description: "Generate personalized learning roadmaps with AI",
    icons: {
        icon: '/icon.svg',
    },
};

/**
 * Root Layout
 * Wraps the application with AuthProvider for authentication state management.
 */
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
