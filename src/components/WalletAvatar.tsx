'use client';

import { useWallet } from '@vechain/vechain-kit';
import { SafeAvatar } from './SafeAvatar';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface WalletAvatarProps {
	size?: string | number;
	showDomain?: boolean;
	showAddress?: boolean;
}

export function WalletAvatar({ 
	size = '40px', 
	showDomain = true, 
	showAddress = false 
}: WalletAvatarProps) {
	const { account } = useWallet();
	const [domain, setDomain] = useState<string>('');

	useEffect(() => {
		// Extract domain from account if available
		if (account?.address) {
			// For now, we'll use a placeholder domain
			// In a real app, you might get this from the wallet or ENS
			setDomain('wallet.vechain');
		}
	}, [account]);

	if (!account?.address) {
		return (
			<Box
				w={size}
				h={size}
				borderRadius="full"
				bg="gray.200"
				display="flex"
				alignItems="center"
				justifyContent="center"
				fontSize="xs"
				color="gray.500"
			>
				?
			</Box>
		);
	}

	return (
		<VStack spacing={1} align="center">
			<SafeAvatar
				domain={domain}
				w={size}
				h={size}
				borderRadius="full"
				fallbackSrc="/logo.png"
				showLoading={true}
			/>
			{showDomain && domain && (
				<Text fontSize="xs" color="gray.500" textAlign="center">
					{domain}
				</Text>
			)}
			{showAddress && (
				<Text fontSize="xs" color="gray.400" textAlign="center" maxW="100px" isTruncated>
					{account.address.slice(0, 6)}...{account.address.slice(-4)}
				</Text>
			)}
		</VStack>
	);
}
