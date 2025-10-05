'use client';

import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import '../../../i18n';
import { useTranslation } from 'react-i18next';
// import { NETWORK_TYPE } from '@vechain-kit/config/network';
import { ClientOnly } from '../../components/ClientOnly';
import { useState, useEffect } from 'react';

// Dynamic import is used here for several reasons:
// 1. The VechainKit component uses browser-specific APIs that aren't available during server-side rendering
// 2. Code splitting - this component will only be loaded when needed, reducing initial bundle size
// 3. The 'ssr: false' option ensures this component is only rendered on the client side
const VeChainKitProvider = dynamic(
	async () => (await import('@vechain/vechain-kit')).VeChainKitProvider,
	{
		ssr: false,
		loading: () => null, // Don't show loading state
	}
);

interface Props {
	children: React.ReactNode;
}

export function VechainKitProviderWrapper({ children }: Props) {
	const { colorMode } = useColorMode();
	const { i18n } = useTranslation();
	const [origin, setOrigin] = useState('');
	const [isReady, setIsReady] = useState(false);
	const [hasError, setHasError] = useState(false);

	const isDarkMode = colorMode === 'dark';

	const coloredLogo =
		'https://i.ibb.co/7G4PQNZ/vechain-kit-logo-colored-circle.png';

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setOrigin(window.location.origin);
			
			// Add error handling for wallet provider conflicts
			const handleError = (error: any) => {
				if (error?.message?.includes('walletProvider') || 
					error?.message?.includes('on is not a function') ||
					error?.message?.includes('@privy-io') ||
					error?.message?.includes('privy') ||
					error?.message?.includes('setWalletProvider')) {
					console.warn('Wallet provider error detected, using fallback mode');
					setHasError(true);
					return true;
				}
				return false;
			};

			// Set up error handling
			const originalError = window.onerror;
			window.onerror = function(message, source, lineno, colno, error) {
				if (handleError({ message, source, lineno, colno, error })) {
					return true;
				}
				if (originalError) {
					return originalError.call(this, message, source, lineno, colno, error);
				}
				return false;
			};

			// Add a small delay to ensure all extensions are loaded
			const timer = setTimeout(() => {
				setIsReady(true);
			}, 200);

			return () => {
				clearTimeout(timer);
				if (originalError) {
					window.onerror = originalError;
				}
			};
		}
	}, []);

	// If there's an error or not ready, return children without VeChainKit
	if (!isReady || hasError) {
		return <>{children}</>;
	}

	return (
		<ClientOnly fallback={children}>
			<VeChainKitProvider
				feeDelegation={{
					delegatorUrl:
						process.env.NEXT_PUBLIC_DELEGATOR_URL ||
						'https://sponsor-testnet.vechain.energy/by/90',
					delegateAllTransactions: false,
					b3trTransfers: {
						minAmountInEther: 1,
					},
				}}
				dappKit={{
					allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
					walletConnectOptions: {
						projectId:
							process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
							'your_wallet_connect_project_id_here',
						metadata: {
							name: 'VeChainKit Demo App',
							description:
								'This is a demo app to show you how the VechainKit works.',
							url: origin,
							icons: [coloredLogo],
						},
					},
				}}
				loginMethods={[
					// { method: 'email', gridColumn: 4 },
					// { method: 'google', gridColumn: 4 },
					{ method: 'vechain', gridColumn: 4 },
					{ method: 'dappkit', gridColumn: 4 },
					{ method: 'ecosystem', gridColumn: 4 },
					// { method: 'passkey', gridColumn: 1 },
					// { method: 'more', gridColumn: 1 },
				]}
				loginModalUI={{
					description:
						'Choose between social login through VeChain or by connecting your wallet.',
				}}
				darkMode={isDarkMode}
				language={i18n.language}
				network={{
					type: (process.env.NEXT_PUBLIC_NETWORK_TYPE || 'test') as
						| 'main'
						| 'test',
				}}
				allowCustomTokens={true}
				legalDocuments={{
					termsAndConditions: [
						{
							url: 'https://vechainkit.vechain.org/terms',
							version: 1,
							required: true,
							displayName: 'Example T&C',
						},
					],
				}}
			>
				{children}
			</VeChainKitProvider>
		</ClientOnly>
	);
}
