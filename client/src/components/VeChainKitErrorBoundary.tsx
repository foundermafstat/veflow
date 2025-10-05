'use client';

import { ReactNode, Component, ErrorInfo } from 'react';

interface VeChainKitErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface VeChainKitErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

/**
 * Error boundary specifically for VeChainKit errors
 * Handles wallet provider conflicts and extension errors
 */
export class VeChainKitErrorBoundary extends Component<
	VeChainKitErrorBoundaryProps,
	VeChainKitErrorBoundaryState
> {
	constructor(props: VeChainKitErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): VeChainKitErrorBoundaryState {
		// Check if this is a VeChainKit, wallet provider, or Privy error
		const isWalletError = 
			error.message.includes('walletProvider') ||
			error.message.includes('on is not a function') ||
			error.message.includes('VeChainKit') ||
			error.message.includes('ethereum') ||
			error.message.includes('@privy-io') ||
			error.message.includes('privy') ||
			error.message.includes('setWalletProvider') ||
			error.stack?.includes('chrome-extension');

		if (isWalletError) {
			console.warn('Wallet provider error caught by boundary:', error.message);
			return { hasError: true, error };
		}

		// For other errors, let them propagate
		throw error;
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.warn('VeChainKit Error Boundary caught an error:', error, errorInfo);
		
		// Log to console for debugging
		if (process.env.NODE_ENV === 'development') {
			console.group('VeChainKit Error Details');
			console.error('Error:', error);
			console.error('Error Info:', errorInfo);
			console.error('Component Stack:', errorInfo.componentStack);
			console.groupEnd();
		}
	}

	render() {
		if (this.state.hasError) {
			// Return fallback or children without VeChainKit
			return this.props.fallback || this.props.children;
		}

		return this.props.children;
	}
}
