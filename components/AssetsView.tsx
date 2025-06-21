import { VStack, Heading } from "@chakra-ui/react";
import AssetsList from "./AssetsList";
import LoansList from "./LoansList";
import InvestmentsList from "./InvestmentsList";

export default function AssetsView() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Your Assets</Heading>
      <AssetsList />
      <LoansList />
      <InvestmentsList />
    </VStack>
  );
}