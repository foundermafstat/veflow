'use client';

import { ReactNode, useEffect, useState } from 'react';

interface HydrationBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * Component that prevents hydration mismatches by ensuring
 * children are only rendered after hydration is complete
 */
export function HydrationBoundary({
	children,
	fallback = null,
}: HydrationBoundaryProps) {
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		// Use a small delay to ensure all hydration is complete
		const timer = setTimeout(() => {
			setIsHydrated(true);
		}, 0);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	if (!isHydrated) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
