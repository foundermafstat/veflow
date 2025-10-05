'use client';

import { useState, useEffect } from 'react';
import { Image, ImageProps, Spinner, Box } from '@chakra-ui/react';
import { loadAvatar, getFallbackAvatarUrl } from '@/lib/avatar-utils';

interface SafeAvatarProps extends Omit<ImageProps, 'src'> {
	domain: string;
	fallbackSrc?: string;
	showLoading?: boolean;
}

export function SafeAvatar({ 
	domain, 
	fallbackSrc, 
	showLoading = true,
	...props 
}: SafeAvatarProps) {
	const [avatarSrc, setAvatarSrc] = useState<string>(
		fallbackSrc || getFallbackAvatarUrl()
	);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		let isMounted = true;
		let abortController: AbortController | null = null;

		const loadAvatarAsync = async () => {
			try {
				setIsLoading(true);
				setHasError(false);
				
				// Create abort controller for cancellation
				abortController = new AbortController();
				
				const src = await loadAvatar(domain);

				if (isMounted && !abortController.signal.aborted) {
					setAvatarSrc(src);
					setHasError(false);
				}
			} catch (error) {
				if (isMounted && !abortController?.signal.aborted) {
					console.warn(`Error loading avatar for ${domain}:`, error);
					setAvatarSrc(fallbackSrc || getFallbackAvatarUrl());
					setHasError(true);
				}
			} finally {
				if (isMounted && !abortController?.signal.aborted) {
					setIsLoading(false);
				}
			}
		};

		// Only load if domain is provided
		if (domain && domain.trim() !== '') {
			loadAvatarAsync();
		} else {
			setAvatarSrc(fallbackSrc || getFallbackAvatarUrl());
			setIsLoading(false);
		}

		return () => {
			isMounted = false;
			if (abortController) {
				abortController.abort();
			}
		};
	}, [domain, fallbackSrc]);

	const handleImageError = () => {
		setAvatarSrc(fallbackSrc || getFallbackAvatarUrl());
		setIsLoading(false);
		setHasError(true);
	};

	// Show loading spinner if loading and showLoading is true
	if (isLoading && showLoading) {
		return (
			<Box
				{...props}
				className="flex items-center justify-center bg-gray-100 rounded-full"
			>
				<Spinner size="sm" />
			</Box>
		);
	}

	return (
		<Image
			src={avatarSrc}
			alt={`Avatar for ${domain}`}
			loading="lazy"
			onError={handleImageError}
			fallback={
				<Box
					{...props}
					className="flex items-center justify-center bg-gray-100 rounded-full text-xs text-gray-500"
				>
					{domain ? domain.charAt(0).toUpperCase() : '?'}
				</Box>
			}
			{...props}
		/>
	);
}
