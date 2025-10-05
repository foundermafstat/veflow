import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	try {
		const { path } = await params;
		const pathString = path.join('/');
		
		// Validate the path
		if (!pathString || pathString.trim() === '') {
			return new NextResponse('Invalid domain', { status: 400 });
		}

		const avatarUrl = `https://testnet.vet.domains/api/avatar/${pathString}`;

		// Fetch the avatar from the external API with timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

		try {
			const response = await fetch(avatarUrl, {
				headers: {
					'User-Agent': 'VeFlow/1.0',
					'Accept': 'image/*',
				},
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				console.warn(`Avatar not found for ${pathString}: ${response.status}`);
				return new NextResponse('Avatar not found', { status: 404 });
			}

			// Check if the response is actually an image
			const contentType = response.headers.get('content-type');
			if (!contentType || !contentType.startsWith('image/')) {
				console.warn(`Invalid content type for ${pathString}: ${contentType}`);
				return new NextResponse('Invalid image format', { status: 400 });
			}

			const imageBuffer = await response.arrayBuffer();

			// Validate image size (max 5MB)
			if (imageBuffer.byteLength > 5 * 1024 * 1024) {
				console.warn(`Image too large for ${pathString}: ${imageBuffer.byteLength} bytes`);
				return new NextResponse('Image too large', { status: 413 });
			}

			// Return the image with proper CORS headers
			return new NextResponse(imageBuffer, {
				status: 200,
				headers: {
					'Content-Type': contentType,
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET',
					'Access-Control-Allow-Headers': 'Content-Type',
					'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
					'ETag': `"${pathString}-${Date.now()}"`, // Simple ETag for caching
				},
			});
		} catch (fetchError) {
			clearTimeout(timeoutId);
			
			if (fetchError instanceof Error && fetchError.name === 'AbortError') {
				console.warn(`Avatar fetch timeout for ${pathString}`);
				return new NextResponse('Request timeout', { status: 408 });
			}
			
			throw fetchError;
		}
	} catch (error) {
		console.error('Error fetching avatar:', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
}
