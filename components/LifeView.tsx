import { VStack, Heading } from "@chakra-ui/react";
import EventCard from "./EventCard";
import Timeline from "./Timeline";

export default function LifeView() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Life Events</Heading>
      <EventCard />
      <Heading size="sm">Timeline</Heading>
      <Timeline />
    </VStack>
  );
}
