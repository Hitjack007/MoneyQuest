import { Box, Flex, Text } from "@chakra-ui/react";
import { useGameStore } from "../state/gameStore";

export default function TopBar() {
  const balance = useGameStore((s) => s.balance);
  const assets = useGameStore((s) => s.assets);
  const loans = useGameStore((s) => s.loans);

  const assetSummary = assets.length
    ? assets.map((a) => a.name).join(", ")
    : "None";
  const loanSum = loans.reduce((a, l) => a + l.balance, 0);

  return (
    <Box bg="teal.600" color="white" py={2} px={4}>
      <Flex align="center" justify="space-between" wrap="wrap">
        <Text fontWeight="bold">
          Balance: ${balance.toFixed(2)}
        </Text>
        <Text>
          Assets Owned: {assets.length} {assets.length ? `(${assetSummary})` : ""}
        </Text>
        <Text>
          Owing: ${loanSum.toFixed(2)}
        </Text>
      </Flex>
    </Box>
  );
}