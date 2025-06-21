import { Box, VStack, Text, HStack, Button } from "@chakra-ui/react";
import { useGameStore } from "../state/gameStore";

export default function InvestmentsList() {
  const investments = useGameStore((s) => s.investments);

  return (
    <VStack align="stretch" spacing={3}>
      {investments.length === 0 && <Text>No investments yet.</Text>}
      {investments.map((inv) => (
        <Box key={inv.id} borderWidth={1} borderRadius="md" p={2}>
          <HStack justify="space-between">
            <Box>
              <Text fontWeight="bold">{inv.type.toUpperCase()}</Text>
              <Text fontSize="sm">Amount: ${inv.amount.toFixed(2)}</Text>
              <Text fontSize="sm">
                Current Value: ${inv.value.toFixed(2)}
              </Text>
            </Box>
            <Button size="sm" isDisabled>
              Sell
            </Button>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}