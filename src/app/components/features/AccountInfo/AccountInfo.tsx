'use client';

import { Box, Heading, Text, Spinner, HStack, VStack } from '@chakra-ui/react';
import { useGetB3trBalance } from '@vechain/vechain-kit';
import { useSafeWallet } from '@/hooks/useSafeWallet';
import { WalletAvatar } from '@/components/WalletAvatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AccountInfo() {
	const { smartAccount, connectedWallet } = useSafeWallet();

	// Only use B3TR balance hook if smartAccount.address exists
	const { data: b3trBalance, isLoading: b3trBalanceLoading } =
		useGetB3trBalance(smartAccount.address ?? undefined);

	return (
		<div className="space-y-6">
			{smartAccount.address && (
				<Card className="wallet-card">
					<CardHeader>
						<div className="flex items-center space-x-4">
							<Avatar className="h-12 w-12">
								<AvatarImage src="/avatar-fallback.svg" alt="Smart Account" />
								<AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
									SA
								</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle className="text-white">Smart Account</CardTitle>
								<CardDescription className="text-gray-400">
									Connected Wallet
								</CardDescription>
							</div>
							<Badge variant="vechain">Active</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<Text data-testid="smart-account-address" className="font-mono text-sm text-gray-300">
								Smart Account: {smartAccount.address}
							</Text>
						</div>
						<div>
							<Text data-testid="is-sa-deployed" className="text-sm text-gray-300">
								Deployed: {smartAccount.isDeployed.toString()}
							</Text>
						</div>
						<div>
							{b3trBalanceLoading ? (
								<Spinner size="sm" className="text-blue-400" />
							) : (
								<Text data-testid="b3tr-balance" className="text-sm text-gray-300">
									B3TR Balance: {b3trBalance?.formatted}
								</Text>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			<Card className="wallet-card">
				<CardHeader>
					<div className="flex items-center space-x-4">
						<Avatar className="h-12 w-12">
							<AvatarImage src="/avatar-fallback.svg" alt="Wallet" />
							<AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
								W
							</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className="text-white">Wallet</CardTitle>
							<CardDescription className="text-gray-400">
								Connected Account
							</CardDescription>
						</div>
						<Badge variant="success">Connected</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<Text data-testid="connected-wallet-address" className="font-mono text-sm text-gray-300">
						Address: {connectedWallet?.address}
					</Text>
				</CardContent>
			</Card>
		</div>
	);
}
