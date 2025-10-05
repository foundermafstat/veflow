'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ClientOnly } from './ClientOnly';

interface SafeVeChainKitProviderProps {
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * Safe wrapper for VeChainKit that handles initialization errors
 * and prevents wallet provider conflicts
 */
export function SafeVeChainKitProvider({ 
	children, 
	fallback = null 
}: SafeVeChainKitProviderProps) {
	const [isSafe, setIsSafe] = useState(false);
	const [VeChainKitProvider, setVeChainKitProvider] = useState<any>(null);

	useEffect(() => {
		const initializeVeChainKit = async () => {
			try {
				// Wait for extensions to load
				await new Promise(resolve => setTimeout(resolve, 200));

				// Check if window.ethereum is available and safe
				if (typeof window !== 'undefined' && window.ethereum) {
					// Test if ethereum is properly configured
					try {
						const ethereum = window.ethereum;
						if (ethereum && typeof ethereum.isConnected === 'function') {
							// Ethereum is properly configured
							const { VeChainKitProvider: Provider } = await import('@vechain/vechain-kit');
							setVeChainKitProvider(() => Provider);
							setIsSafe(true);
						} else {
							// Ethereum is not properly configured, use fallback
							setIsSafe(false);
						}
					} catch (error) {
						console.warn('Ethereum provider check failed:', error);
						setIsSafe(false);
					}
				} else {
					// No ethereum provider, use fallback
					setIsSafe(false);
				}
			} catch (error) {
				console.warn('VeChainKit initialization failed:', error);
				setIsSafe(false);
			}
		};

		initializeVeChainKit();
	}, []);

	if (!isSafe || !VeChainKitProvider) {
		return <>{fallback || children}</>;
	}

	return (
		<ClientOnly fallback={fallback || children}>
			<VeChainKitProvider>
				{children}
			</VeChainKitProvider>
		</ClientOnly>
	);
}
