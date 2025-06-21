import { VStack, Text, Box } from "@chakra-ui/react";
import { useGameStore } from "../state/gameStore";

export default function Timeline() {
  const timeline = useGameStore((s) => s.timeline);

  return (
    <VStack align="stretch" spacing={1} maxH={200} overflowY="auto">
      {timeline.length === 0 && (
        <Text color="gray.400">No events yet. Play to experience life’s surprises!</Text>
      )}
      {timeline.map((item, idx) => (
        <Box key={idx} p={1} borderBottom="1px solid #eee">
          <Text fontSize="sm">
            {item.date.toDateString()}: {item.event}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}