import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { useGameStore } from "../state/gameStore";

export default function EventCard() {
  const eventQueue = useGameStore((s) => s.eventQueue);
  const nextEvent = useGameStore((s) => s.nextEvent);

  if (eventQueue.length === 0) return null;
  const currEvent = eventQueue[0];

  return (
    <Box
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      p={4}
      my={4}
      border="2px solid #4444"
    >
      <Text fontWeight="bold" mb={2}>
        {currEvent.desc}
      </Text>
      <VStack align="stretch" spacing={2}>
        {currEvent.choices.map((c, idx) => (
          <Button
            key={idx}
            onClick={() => {
              c.apply(useGameStore.getState());
              nextEvent();
            }}
          >
            {c.label} <span style={{ fontSize: "0.85em", color: "#888" }}>({c.feedback})</span>
          </Button>
        ))}
      </VStack>
    </Box>
  );
}