import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import TopBar from "./components/TopBar";
import LifeView from "./components/LifeView";
import AssetsView from "./components/AssetsView";
import CalendarClock from "./components/CalendarClock";
import FeedbackBox from "./components/FeedbackBox";
import { useGameStore } from "./state/gameStore";
import GameOverModal from "./components/GameOverModal";

export default function App() {
  const bankrupt = useGameStore((s) => s.bankrupt);

  return (
    <Flex direction="column" minH="100vh">
      <TopBar />
      <Flex flex="1" position="relative">
        <Box position="absolute" top={4} right={4} zIndex={2}>
          <CalendarClock />
        </Box>
        <Tabs variant="enclosed" w="100%" mt={2}>
          <TabList>
            <Tab>Life View</Tab>
            <Tab>Assets View</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LifeView />
            </TabPanel>
            <TabPanel>
              <AssetsView />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <FeedbackBox />
      <GameOverModal isOpen={bankrupt} />
    </Flex>
  );
}