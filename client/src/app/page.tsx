'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const LandingPage = dynamic(() => import('@/components/landing/LandingPage'), {
	ssr: false,
});

export default function Page() {
	return <LandingPage />;
}
