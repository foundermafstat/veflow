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
import { Button as UIButton } from '@/components/ui/button';
import { 
	ChevronDown, 
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
			<div className="flex items-center">
				{/* Wallet Button */}
				<WalletButton
					mobileVariant="iconOnly"
					desktopVariant="iconDomainAndAssets"
					className="wallet-button"
				/>
			</div>
		);
	} catch (error) {
		// Wallet provider not available yet
		return <></>;
	}
}

export function Header(): ReactElement {
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
				<div className="w-full flex justify-center">
					<div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
						<div className="h-16 flex items-center justify-between">
						{/* Logo */}
						<Link href="/">
							<div className="cursor-pointer transition-transform duration-200">
								{/* Dark logo for light theme */}
								<Image
									src="/veflow-black.png"
									alt="VeFlow"
									className="h-8 w-auto max-w-32 max-h-8 logo-dark"
								/>
								{/* Light logo for dark theme */}
								<Image
									src="/veflow-white.png"
									alt="VeFlow"
									className="h-8 w-auto max-w-32 max-h-8 logo-light"
								/>
							</div>
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden lg:flex pl-10 items-center space-x-1">
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
												<span className="text-sm flex items-center space-x-1">
													<span>{item.label}</span>
													<ChevronDown className="w-3 h-3" />
												</span>
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

							{/* Wallet Button */}
							<WalletSection />
						</div>
						</div>
					</div>
				</div>
			</header>
		</>
	);
}
