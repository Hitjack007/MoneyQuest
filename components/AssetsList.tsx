import { Box, VStack, Text, Progress, HStack, Button } from "@chakra-ui/react";
import { useGameStore } from "../state/gameStore";

export default function AssetsList() {
  const assets = useGameStore((s) => s.assets);

  return (
    <VStack align="stretch" spacing={3}>
      {assets.length === 0 && <Text>No assets owned.</Text>}
      {assets.map((a) => (
        <Box key={a.id} borderWidth={1} borderRadius="md" p={2}>
          <HStack justify="space-between">
            <Box>
              <Text fontWeight="bold">{a.name}</Text>
              <Text fontSize="sm">
                Type: {a.type} | Tier: {a.tier}
              </Text>
            </Box>
            <Box w={24}>
              <Progress value={a.health} colorScheme="green" size="sm" />
              <Text fontSize="xs" textAlign="center">
                {a.health}% health
              </Text>
            </Box>
            {/* Upgrade/Sell (future) */}
            <Button size="sm" isDisabled>
              Upgrade
            </Button>
            <Button size="sm" colorScheme="red" isDisabled>
              Sell
            </Button>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}