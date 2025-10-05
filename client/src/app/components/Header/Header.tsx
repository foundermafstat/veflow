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
	Image,
} from '@chakra-ui/react';
// Custom icons as simple text/symbols
import { useWallet, WalletButton } from '@vechain/vechain-kit';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useColorMode } from '@chakra-ui/react';
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
	const { colorMode } = useColorMode();

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
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
					isScrolled 
						? 'glass-effect border-b border-border' 
						: 'bg-background/80 backdrop-blur-sm'
				}`}
			>
				<div className="max-w-7xl mx-auto px-4">
					<div className="h-16 flex items-center justify-between">
						{/* Logo */}
						<Link href="/">
							<div className="cursor-pointer hover:scale-105 transition-transform duration-200">
								<Image
									src={colorMode === 'dark' ? '/veflow-white.png' : '/veflow-black.png'}
									alt="VeFlow"
									height="32px"
									width="auto"
									fallbackSrc="/veflow-black.svg"
								/>
							</div>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex space-x-2">
							{navItems.map((item) => (
								<Link key={item.href} href={item.href}>
									<UIButton
										variant="ghost"
										size="sm"
										className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md px-3 py-2"
									>
										{item.label}
									</UIButton>
								</Link>
							))}
						</div>

						<div className="flex-1" />

						{/* Right side controls */}
						<div className="flex space-x-2">
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
								className="flex md:hidden hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md"
							>
								☰
							</IconButton>
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Drawer */}
			<Drawer isOpen={isOpen} placement="right" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent className="glass-effect">
					<DrawerCloseButton />
					<DrawerHeader>
						<Box>
							<Image
								src={colorMode === 'dark' ? '/veflow-white.png' : '/veflow-black.png'}
								alt="VeFlow"
								height="32px"
								width="auto"
								fallbackSrc="/veflow-black.png"
							/>
						</Box>
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
										className="w-full justify-start hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md"
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
