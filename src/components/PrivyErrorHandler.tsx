'use client';

import { useEffect } from 'react';

/**
 * Component to handle Privy.io related errors
 * These errors often occur due to conflicts with other wallet providers
 */
export function PrivyErrorHandler() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Handle unhandled promise rejections from Privy
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason;
            const errorMessage = reason?.message || reason?.toString() || '';
            
            if (
                errorMessage.includes('@privy-io') ||
                errorMessage.includes('privy') ||
                errorMessage.includes('setWalletProvider') ||
                errorMessage.includes('_this_walletProvider.on is not a function')
            ) {
                console.warn('Privy error caught and suppressed:', errorMessage);
                event.preventDefault(); // Prevent the error from showing in console
                return;
            }
        };

        // Handle global errors from Privy
        const originalOnError = window.onerror;
        window.onerror = function(message, source, lineno, colno, error) {
            const errorMessage = message?.toString() || '';
            
            if (
                errorMessage.includes('@privy-io') ||
                errorMessage.includes('privy') ||
                errorMessage.includes('setWalletProvider') ||
                errorMessage.includes('_this_walletProvider.on is not a function') ||
                source?.includes('@privy-io')
            ) {
                console.warn('Privy error caught and suppressed:', errorMessage);
                return true; // Prevent the error from propagating
            }

            if (originalOnError) {
                return originalOnError.call(this, message, source, lineno, colno, error);
            }
            return false;
        };

        // Add event listener for unhandled rejections
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        // Cleanup
        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            if (originalOnError) {
                window.onerror = originalOnError;
            }
        };
    }, []);

    return null;
}
