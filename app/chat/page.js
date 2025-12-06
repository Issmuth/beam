'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header, InputBar, ChatBubble } from '../components';
import { useAuth } from '../contexts/AuthContext';
import AuthGuard from '../components/auth/AuthGuard';

/**
 * Chat Page - Conversational interface with Gemini AI
 */
export default function ChatPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const messagesEndRef = useRef(null);
    const initialGoalProcessed = useRef(false);
    const { getIdToken } = useAuth();

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [roadmapData, setRoadmapData] = useState(null);
    const [lastFailedMessage, setLastFailedMessage] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const goal = searchParams.get('goal');
        if (goal && !initialGoalProcessed.current) {
            initialGoalProcessed.current = true;
            handleSendMessage(goal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const getErrorMessage = (error, statusCode) => {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return 'Unable to connect to the server. Please check your internet connection and try again.';
        }

        if (statusCode) {
            switch (statusCode) {
                case 400:
                    return 'Invalid request. Please try rephrasing your message.';
                case 500:
                    return 'Server configuration error. Please try again later.';
                case 502:
                    return 'The AI service is temporarily unavailable. Please try again in a moment.';
                case 429:
                    return 'Too many requests. Please wait a moment before trying again.';
                default:
                    if (statusCode >= 500) {
                        return 'Server error. Please try again later.';
                    }
                    return 'Something went wrong. Please try again.';
            }
        }

        if (!navigator.onLine) {
            return 'You appear to be offline. Please check your internet connection and try again.';
        }

        return 'Sorry, I encountered an error. Please try again.';
    };

    const handleSendMessage = async (messageText, isRetry = false) => {
        if (!messageText.trim() || isLoading) return;

        const trimmedMessage = messageText.trim();

        if (!isRetry) {
            const userMessage = {
                role: 'user',
                content: trimmedMessage,
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, userMessage]);
        }

        setInputValue('');
        setIsLoading(true);
        setLastFailedMessage(null);

        let statusCode = null;

        try {
            const conversationHistory = messages
                .filter((msg) => !msg.isError)
                .map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                }));

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: trimmedMessage,
                    conversationHistory,
                }),
            });

            statusCode = response.status;

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.error || 'API request failed');
                error.statusCode = statusCode;
                throw error;
            }

            const data = await response.json();

            const systemMessage = {
                role: 'system',
                content: data.text,
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, systemMessage]);

            if (data.roadmap) {
                setRoadmapData(data.roadmap);
                try {
                    const token = await getIdToken();
                    if (token) {
                        await fetch('/api/roadmaps', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ roadmap: data.roadmap })
                        });
                    }
                } catch (saveError) {
                    console.error('Error saving roadmap to database:', saveError);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setLastFailedMessage(trimmedMessage);

            const errorContent = getErrorMessage(error, error.statusCode || statusCode);

            const errorMessage = {
                role: 'system',
                content: errorContent,
                timestamp: Date.now(),
                isError: true,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        if (lastFailedMessage) {
            handleSendMessage(lastFailedMessage, true);
        }
    };

    const handleSubmit = (value) => {
        handleSendMessage(value);
    };

    const handleViewRoadmap = () => {
        router.push('/roadmap');
    };

    return (
        <AuthGuard>
            <main className="min-h-screen flex flex-col">
                <Header showBackButton title="Chat" />

                {/* Messages container */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
                    <div className="max-w-3xl mx-auto">
                        {messages.length === 0 && !isLoading && (
                            <div className="text-center py-16 animate-fade-in">
                                <div className="w-16 h-16 rounded-2xl bg-beam-gradient-subtle flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-beam-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-white font-medium mb-2">Start a conversation</p>
                                <p className="text-beam-text-secondary text-sm">Tell me about your learning goals!</p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div key={`${message.timestamp}-${index}`}>
                                <ChatBubble
                                    role={message.role}
                                    content={message.content}
                                    timestamp={message.timestamp}
                                    isError={message.isError}
                                />
                                {message.isError && lastFailedMessage && index === messages.length - 1 && !isLoading && (
                                    <div className="flex justify-start mb-4 ml-2">
                                        <button
                                            onClick={handleRetry}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-white glass-card hover:bg-white/10 transition-all duration-200"
                                            aria-label="Retry sending message"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                />
                                            </svg>
                                            Retry
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start mb-4 animate-fade-in">
                                <div className="glass-card px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 bg-beam-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-beam-glow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-beam-accent-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                        <span className="text-beam-text-secondary text-sm">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* View Roadmap button */}
                {roadmapData && (
                    <div className="px-4 md:px-6 py-3">
                        <div className="max-w-3xl mx-auto">
                            <button
                                onClick={handleViewRoadmap}
                                className="w-full py-3.5 bg-beam-gradient text-white font-medium rounded-2xl hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2"
                                aria-label="View Roadmap"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                View Roadmap
                            </button>
                        </div>
                    </div>
                )}

                {/* Input bar */}
                <div className="px-4 md:px-6 py-4 border-t border-white/5">
                    <div className="max-w-3xl mx-auto">
                        <InputBar
                            value={inputValue}
                            onChange={setInputValue}
                            onSubmit={handleSubmit}
                            placeholder="Type your message..."
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </main>
        </AuthGuard>
    );
}
