/**
 * Avatar utilities for handling avatar loading with fallbacks
 */

/**
 * Get avatar URL with fallback to local proxy
 */
export function getAvatarUrl(domain: string): string {
	// Use our local proxy to avoid CORS issues
	return `/api/avatar/${domain}`;
}

/**
 * Get fallback avatar URL
 */
export function getFallbackAvatarUrl(): string {
	// Return a default avatar or placeholder
	return '/avatar-fallback.svg'; // Using a proper avatar fallback
}

/**
 * Safe avatar loading with error handling
 */
export async function loadAvatar(domain: string): Promise<string> {
	try {
		// Validate domain
		if (!domain || domain.trim() === '') {
			throw new Error('Invalid domain');
		}

		const avatarUrl = getAvatarUrl(domain);

		// Test if the avatar exists with better error handling
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

		try {
			const response = await fetch(avatarUrl, {
				method: 'HEAD',
				signal: controller.signal,
				headers: {
					'Accept': 'image/*',
				},
			});

			clearTimeout(timeoutId);

			if (response.ok) {
				// Check if it's actually an image
				const contentType = response.headers.get('content-type');
				if (contentType && contentType.startsWith('image/')) {
					return avatarUrl;
				} else {
					console.warn(`Invalid content type for ${domain}: ${contentType}`);
				}
			} else {
				console.warn(`Avatar not found for ${domain}: ${response.status}`);
			}
		} catch (fetchError) {
			clearTimeout(timeoutId);
			
			if (fetchError instanceof Error && fetchError.name === 'AbortError') {
				console.warn(`Avatar fetch timeout for ${domain}`);
			} else {
				console.warn(`Failed to load avatar for ${domain}:`, fetchError);
			}
		}
	} catch (error) {
		console.warn(`Error processing avatar for ${domain}:`, error);
	}

	// Return fallback avatar
	return getFallbackAvatarUrl();
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
	return typeof window !== 'undefined';
}
