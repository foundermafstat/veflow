'use client';

import { type ReactElement } from 'react';
import {
	Box,
	Flex,
	Heading,
	HStack,
	Spacer,
	Button,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useDisclosure,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	VStack,
	Divider,
	Text,
} from '@chakra-ui/react';
// Custom icons as simple text/symbols
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/app/components/features/ThemeToggle';
import { LanguageSelector } from '@/app/components/features/LanguageSelector';
import { WalletAvatar } from '@/components/WalletAvatar';
import { Button as UIButton } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Safe wrapper for wallet functionality
function WalletSection(): ReactElement {
	try {
		const { account } = useWallet();
		return (
			<>
				{/* Wallet Avatar */}
				{account && (
					<Avatar className="h-8 w-8">
						<AvatarImage src="/avatar-fallback.svg" alt="Wallet" />
						<AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
							{account.address.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				)}
				
				{/* Wallet Button */}
				<WalletButton
					mobileVariant="iconOnly"
					desktopVariant="iconDomainAndAssets"
				/>

				{/* Connection Status Badge */}
				{account && (
					<Badge variant="vechain" className="hidden sm:inline-flex">
						Connected
					</Badge>
				)}
			</>
		);
	} catch (error) {
		// Wallet provider not available yet
		return <></>;
	}
}

export function Header(): ReactElement {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isScrolled, setIsScrolled] = useState(false);

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Test', href: '/test' },
	];

	return (
		<>
			<Box
				as="header"
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
					isScrolled 
						? 'bg-slate-900/95 backdrop-blur-md border-b border-gray-700' 
						: 'bg-transparent'
				}`}
			>
				<Box className="max-w-7xl mx-auto px-4">
					<Flex className="h-16 items-center justify-between">
						{/* Logo */}
						<Link href="/">
							<Heading
								size="md"
								className="gradient-text cursor-pointer hover:scale-105 transition-transform duration-200"
							>
								VeFlow
							</Heading>
						</Link>

						{/* Desktop Navigation */}
						<HStack className="hidden md:flex space-x-8">
							{navItems.map((item) => (
								<Link key={item.href} href={item.href}>
									<UIButton
										variant="ghost"
										size="sm"
										className="hover:bg-gray-700 hover:-translate-y-1 transition-all duration-200"
									>
										{item.label}
									</UIButton>
								</Link>
							))}
						</HStack>

						<div className="flex-1" />

						{/* Right side controls */}
						<HStack className="space-x-4">
							{/* Theme toggle */}
							<ThemeToggle />

							{/* Language selector */}
							<LanguageSelector />

							{/* Wallet Button */}
							<WalletSection />

							{/* Mobile menu button */}
							<IconButton
								aria-label="Open menu"
								onClick={onOpen}
								variant="ghost"
								size="sm"
								className="flex md:hidden hover:bg-gray-700"
							>
								☰
							</IconButton>
						</HStack>
					</Flex>
				</Box>
			</Box>

			{/* Mobile Drawer */}
			<Drawer isOpen={isOpen} placement="right" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent className="bg-slate-900/95 backdrop-blur-md">
					<DrawerCloseButton />
					<DrawerHeader>
						<Heading
							size="md"
							className="gradient-text"
						>
							VeFlow
						</Heading>
					</DrawerHeader>

					<DrawerBody>
						<VStack className="space-y-4 items-stretch">
							{/* Wallet Status */}
							<WalletSection />

							{/* Navigation Links */}
							{navItems.map((item) => (
								<Link key={item.href} href={item.href} onClick={onClose}>
									<UIButton
										variant="ghost"
										size="lg"
										className="w-full justify-start hover:bg-gray-700"
									>
										{item.label}
									</UIButton>
								</Link>
							))}

							{/* <Divider /> */}

							{/* Theme Toggle */}
							<Box onClick={onClose}>
								<ThemeToggle />
							</Box>

							{/* Language Selector */}
							<Box onClick={onClose}>
								<LanguageSelector />
							</Box>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}
