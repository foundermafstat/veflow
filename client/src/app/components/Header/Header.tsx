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
	Menu as ChakraMenu,
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
import { 
	ChevronDown, 
	Menu, 
	X,
	Home,
	Workflow,
	LayoutDashboard,
	TestTube,
	MessageSquare,
	BookOpen,
	FileText
} from 'lucide-react';

// Safe wrapper for wallet functionality
function WalletSection(): ReactElement {
	try {
		const { account } = useWallet();
		return (
			<div className="flex items-center space-x-2">
				{/* Wallet Avatar */}
				{account && (
					<Avatar className="h-8 w-8 ring-2 ring-primary/20">
						<AvatarImage src="/avatar-fallback.svg" alt="Wallet" />
						<AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium">
							{account.address.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				)}
				
				{/* Wallet Button */}
				<WalletButton
					mobileVariant="iconOnly"
					desktopVariant="iconDomainAndAssets"
				/>

			</div>
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
		{ 
			label: 'Platform', 
			href: '#',
			children: [
				{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Manage your flows and analytics' },
				{ label: 'Flows', href: '/flows', icon: Workflow, description: 'Create and manage workflows' },
				{ label: 'Flow Builder', href: '/flow', icon: Workflow, description: 'Visual flow creation tool' },
			]
		},
		{ 
			label: 'Development', 
			href: '#',
			children: [
				{ label: 'Test Environment', href: '/test', icon: TestTube, description: 'Test your smart contracts' },
				{ label: 'Telegram Bot', href: '/telegram', icon: MessageSquare, description: 'Telegram integration tools' },
			]
		},
		{ 
			label: 'Resources', 
			href: '#',
			children: [
				{ label: 'Documentation', href: '/docs', icon: BookOpen, description: 'API and user guides' },
				{ label: 'Smart Contracts', href: '/contracts', icon: FileText, description: 'Contract addresses and ABIs' },
			]
		},
	];

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
					isScrolled 
						? 'glass-effect border-b border-border shadow-lg' 
						: 'bg-background/95 backdrop-blur-md'
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
						<nav className="hidden lg:flex pl-5 items-center space-x-1">
							{navItems.map((item) => (
								<div key={item.label}>
									{item.children ? (
										<ChakraMenu>
											<MenuButton
												as={UIButton}
												variant="ghost"
												size="sm"
												className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md p-4 h-9 flex items-center space-x-2"
											>
												<span className="text-sm">{item.label} <ChevronDown className="w-3 h-3" /></span>
												
											</MenuButton>
											<MenuList 
												className="min-w-[280px] bg-popover border border-border shadow-lg rounded-lg p-2"
											>
												{item.children.map((child) => {
													const Icon = child.icon;
													return (
														<MenuItem key={child.href} as={Link} href={child.href}>
															<div className="flex items-start space-x-3 w-full p-2 rounded-md hover:bg-accent transition-colors">
																<div className="flex-shrink-0 mt-0.5">
																	<Icon className="w-4 h-4 text-muted-foreground" />
																</div>
																<div className="flex-1 min-w-0">
																	<div className="font-medium text-sm text-foreground">
																		{child.label}
																	</div>
																	<div className="text-xs text-muted-foreground mt-1">
																		{child.description}
																	</div>
																</div>
															</div>
														</MenuItem>
													);
												})}
											</MenuList>
										</ChakraMenu>
									) : (
										<Link href={item.href}>
									<UIButton
										variant="ghost"
										size="sm"
												className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md px-4 py-2 h-9"
									>
										{item.label}
									</UIButton>
								</Link>
									)}
								</div>
							))}
						</nav>

						<div className="flex-1" />

						{/* Right side controls */}
						<div className="flex items-center space-x-1">
							{/* Theme toggle */}
							<div className="hidden sm:block">
							<ThemeToggle />
							</div>

							{/* Language selector */}
							<div className="hidden sm:block">
							<LanguageSelector />
							</div>

							{/* Wallet Button */}
							<WalletSection />

							{/* Mobile menu button */}
							<IconButton
								aria-label="Open menu"
								onClick={onOpen}
								variant="ghost"
								size="sm"
								className="flex lg:hidden hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md ml-2"
							>
								<Menu className="w-5 h-5" />
							</IconButton>
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Drawer */}
			<Drawer isOpen={isOpen} placement="right" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent className="glass-effect border-l border-border">
					<DrawerCloseButton className="text-muted-foreground hover:text-foreground" />
					<DrawerHeader className="border-b border-border">
						<Box className="flex items-center space-x-3">
							<Image
								src={colorMode === 'dark' ? '/veflow-white.png' : '/veflow-black.png'}
								alt="VeFlow"
								height="32px"
								width="auto"
								fallbackSrc="/veflow-black.png"
							/>
							<span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								VeFlow
							</span>
						</Box>
					</DrawerHeader>

					<DrawerBody className="px-4">
						<VStack className="space-y-4 items-stretch">
							{/* Wallet Status */}
							<WalletSection />

							<Divider />

							{/* Navigation Links */}
							{navItems.map((item) => (
								<div key={item.label}>
									{item.children ? (
										<div className="space-y-2">
											<div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-3">
												{item.label}
											</div>
											{item.children.map((child) => {
												const Icon = child.icon;
												return (
													<Link key={child.href} href={child.href} onClick={onClose}>
														<div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
															<div className="flex-shrink-0 mt-0.5">
																<Icon className="w-5 h-5 text-muted-foreground" />
															</div>
															<div className="flex-1 min-w-0">
																<div className="font-medium text-sm text-foreground">
																	{child.label}
																</div>
																<div className="text-xs text-muted-foreground mt-1">
																	{child.description}
																</div>
															</div>
														</div>
													</Link>
												);
											})}
										</div>
									) : (
										<Link href={item.href} onClick={onClose}>
									<UIButton
										variant="ghost"
										size="lg"
										className="w-full justify-start hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md"
									>
										{item.label}
									</UIButton>
								</Link>
									)}
								</div>
							))}

							<Divider />

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
