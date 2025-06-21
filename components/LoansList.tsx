import { Box, VStack, Text, HStack, Button } from "@chakra-ui/react";
import { useGameStore } from "../state/gameStore";

export default function LoansList() {
  const loans = useGameStore((s) => s.loans);

  return (
    <VStack align="stretch" spacing={3}>
      {loans.length === 0 && <Text>No active loans.</Text>}
      {loans.map((l) => (
        <Box key={l.id} borderWidth={1} borderRadius="md" p={2}>
          <HStack justify="space-between">
            <Box>
              <Text fontWeight="bold">Loan #{l.id.slice(0, 6)}</Text>
              <Text fontSize="sm">Owed: ${l.balance.toFixed(2)}</Text>
              <Text fontSize="sm">Rate: {l.interestRate}%</Text>
              <Text fontSize="xs">Due: {l.dueDate.toLocaleDateString()}</Text>
            </Box>
            <Button size="sm" colorScheme="blue" isDisabled>
              Pay
            </Button>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}