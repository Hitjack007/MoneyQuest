import { Box, HStack, Text, IconButton } from "@chakra-ui/react";
import { useGameStore } from "../state/gameStore";
import { FaPause, FaPlay, FaForward } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";

export default function CalendarClock() {
  const calendar = useGameStore((s) => s.calendar);
  const advanceTime = useGameStore((s) => s.advanceTime);
  const bankrupt = useGameStore((s) => s.bankrupt);

  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Game loop
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!paused && !bankrupt) {
      interval.current = setInterval(() => {
        advanceTime(speed); // 1 day per tick, speed up if fast-forward
      }, 1000 / speed);

      return () => clearInterval(interval.current!);
    } else {
      if (interval.current) clearInterval(interval.current);
    }
    // eslint-disable-next-line
  }, [paused, speed, bankrupt]);

  return (
    <Box bg="gray.100" p={2} borderRadius="md" boxShadow="md">
      <HStack spacing={2}>
        <Text fontFamily="mono" fontWeight="bold">
          {calendar.toDateString()}
        </Text>
        <IconButton
          aria-label={paused ? "Play" : "Pause"}
          icon={paused ? <FaPlay /> : <FaPause />}
          size="sm"
          onClick={() => setPaused((p) => !p)}
        />
        <IconButton
          aria-label="Fast Forward"
          icon={<FaForward />}
          size="sm"
          colorScheme={speed === 5 ? "teal" : undefined}
          onClick={() => setSpeed((s) => (s === 1 ? 5 : 1))}
        />
      </HStack>
    </Box>
  );
}