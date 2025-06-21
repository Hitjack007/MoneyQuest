import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { useGameStore } from "../state/gameStore";

export default function GameOverModal({ isOpen }: { isOpen: boolean }) {
  const restart = useGameStore((s) => s.restart);
  const balance = useGameStore((s) => s.balance);
  const creditScore = useGameStore((s) => s.creditScore);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Game Over: Bankrupt!</ModalHeader>
        <ModalBody>
          <Text mb={4}>
            You have gone bankrupt. Your final stats:
          </Text>
          <Text>Balance: ${balance.toFixed(2)}</Text>
          <Text>Credit Score: {creditScore}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={restart}>
            Restart Game
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}