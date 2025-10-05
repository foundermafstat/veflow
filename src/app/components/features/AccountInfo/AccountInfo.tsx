'use client';

import { Box, Heading, Text, Spinner, HStack, VStack } from '@chakra-ui/react';
import { useGetB3trBalance } from '@vechain/vechain-kit';
import { useSafeWallet } from '@/hooks/useSafeWallet';
import { WalletAvatar } from '@/components/WalletAvatar';

export function AccountInfo() {
	const { smartAccount, connectedWallet } = useSafeWallet();

	// Only use B3TR balance hook if smartAccount.address exists
	const { data: b3trBalance, isLoading: b3trBalanceLoading } =
		useGetB3trBalance(smartAccount.address ?? undefined);

	return (
		<VStack spacing={6} align="stretch">
			{smartAccount.address && (
				<Box>
					<HStack spacing={4} mb={4}>
						<WalletAvatar size="48px" showDomain={true} showAddress={false} />
						<VStack align="start" spacing={1}>
							<Heading size={'md'}>
								<b>Smart Account</b>
							</Heading>
							<Text fontSize="sm" color="gray.500">
								Connected Wallet
							</Text>
						</VStack>
					</HStack>
					<Text data-testid="smart-account-address" fontFamily="mono" fontSize="sm">
						Smart Account: {smartAccount.address}
					</Text>
					<Text data-testid="is-sa-deployed" fontSize="sm">
						Deployed: {smartAccount.isDeployed.toString()}
					</Text>
					{b3trBalanceLoading ? (
						<Spinner size="sm" />
					) : (
						<Text data-testid="b3tr-balance" fontSize="sm">
							B3TR Balance: {b3trBalance?.formatted}
						</Text>
					)}
				</Box>
			)}

			<Box>
				<HStack spacing={4} mb={4}>
					<WalletAvatar size="48px" showDomain={true} showAddress={true} />
					<VStack align="start" spacing={1}>
						<Heading size={'md'}>
							<b>Wallet</b>
						</Heading>
						<Text fontSize="sm" color="gray.500">
							Connected Account
						</Text>
					</VStack>
				</HStack>
				<Text data-testid="connected-wallet-address" fontFamily="mono" fontSize="sm">
					Address: {connectedWallet?.address}
				</Text>
			</Box>
		</VStack>
	);
}
