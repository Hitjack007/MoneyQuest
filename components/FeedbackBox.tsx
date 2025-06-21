import { Box, Text } from "@chakra-ui/react";
import { useGameStore } from "../state/gameStore";

export default function FeedbackBox() {
  const feedback = useGameStore((s) => s.feedback);

  return (
    <Box bg="yellow.50" borderTop="1px solid #eee" p={2} minH={8}>
      <Text color="gray.700">{feedback || "Event feedback and notifications will appear here."}</Text>
    </Box>
  );
}