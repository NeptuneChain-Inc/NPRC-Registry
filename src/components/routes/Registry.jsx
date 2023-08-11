import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { contract, provider } from "../../contracts/contractRef";
import {
  EventData,
  ProducersData,
  AccountSearch,
  Line,
} from "../elements/index";
import { colors } from "../../data/styles";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const breakpoints = [576, 768, 992, 1200];

// Custom hook to target the breakpoints for responsiveness
const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false);

  useEffect(() => {
    const updateTarget = () => {
      if (window.innerWidth < width) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }
    };
    updateTarget();
    window.addEventListener("resize", updateTarget);
    return () => window.removeEventListener("resize", updateTarget);
  }, [width]);

  return targetReached;
};

const Container = styled(motion.div)`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100vw;
  height: 100vh;
  animation: ${fadeIn} 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Content = styled(motion.div).attrs(() => ({
  initial: "hidden",
  variants: fadeIn,
}))`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  overflow-x: hidden;
  align-items: flex-start; /* Align content to the top of the container */
  overflow-y: auto; // Add vertical scroll if content overflows

  @media (max-width: 768px) {
    width: 80%;
  }
`;


const Heading = styled.h1`
  font-size: ${(props) => (props.isSmallScreen ? "16px" : "24px")};
  font-weight: bold;
`;

const DynamicList = styled.div`
  width: 100%;
  padding: 0 10px;
  border-bottom: 1px solid #00000080;
`;

const Heading2 = styled.h2`
  width: 100%;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-bottom: 20px;
  @media (max-width: ${breakpoints[1]}px) {
    font-size: 1.2em;
  }
  @media (max-width: ${breakpoints[0]}px) {
    font-size: 1em;
  }
`;

const StyledTable = styled.table`
  width: 80%;
  border-collapse: collapse;
  // background-color: ${colors.secondaryAccent};
  border-radius: 8px;
  margin: auto;
  margin-top: 100px;
  overflow: hidden;
  -webkit-box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.75);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledTh = styled.th`
  padding: 10px;
  background: ${colors.accent};
  color: white;
  text-align: center;
  border-right: 2px solid #222;
  &:last-child {
    border-right: none;
  }
`;

const StyledTd = styled.td`
  padding: 8px;
  border-bottom: 1px solid #222;
  border-right: 2px solid #222;
  &:last-child {
    border-right: none;
  }
`;

const LoadingAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  margin: auto;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #568ca9;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${LoadingAnimation} 0.8s infinite linear;
`;

const MessageContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 999;
  display: flex;
  align-items: center;
  background-color: ${({ type }) => (type === "error" ? "#ff9a9a" : "#d8f5e9")};
  color: ${({ type }) => (type === "error" ? "#ff0000" : "#00b800")};
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.25);
`;

const CloseButton = styled.button`
  margin-left: 10px;
  background-color: transparent;
  border: none;
  color: ${({ type }) => (type === "error" ? "#ff0000" : "#00b800")};
  cursor: pointer;
`;

const AccountSearchButton = styled.button`
  border-radius: 10px;
  backdrop-filter: blur(20px);
  padding: 10px;
  border: 1px solid #333;
  background: #222;
  color: white;
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    scale: 1.1;
  }

  @media (max-width: 600px) {
    font-size: 10px;
    padding: 5px;
  }
`;

const FixedTitle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 2px solid #222;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 1000;
`;

const getEventTimestamp = async (blockNumber) => {
  const block = await provider.getBlock(blockNumber);
  const timestamp = block.timestamp;
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

function ExplorerPage() {
  const isSmallScreen = useMediaQuery(768);

  const [data, setData] = useState([]);
  const [producers, setProducers] = useState(null);
  const [producersData, setProducersData] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAccountSearchOpen, setIsAccountSearchOpen] = useState(false);
  const [updateUI, setUpdateUI] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const totalSupply = await contract.getTotalSupply();
        const totalSold = await contract.getTotalSold();
        const totalBurnedSupply = await contract.getTotalDonatedSupply();
        const totalCertificates = await contract.getTotalCertificates();
        const _producers = await contract.getProducers();
        const creditTypes = await contract.getCreditTypes();

        setData([
          {
            label: "Total Supply",
            value:
              totalSupply.toString() +
              " " +
              `${totalSupply.toNumber() > 0 ? "NPCs" : "NPC"}`,
          },
          {
            label: "Total Sold",
            value:
              totalSold.toString() +
              " " +
              `${totalSold.toNumber() > 0 ? "NPCs" : "NPC"}`,
          },
          {
            label: "Total Donated Credits",
            value:
              totalBurnedSupply.toString() +
              " " +
              `${totalBurnedSupply.toNumber() > 0 ? "NPCs" : "NPC"}`,
          },
          { label: "Credit Types", value: creditTypes.join(", ") },
          { label: "Total Certificates", value: totalCertificates.toString() },
          { label: "Total Farmers", value: _producers.length },
        ]);
        setProducers(_producers);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [updateUI]);

  useEffect(() => {
    const fetchProducerData = async () => {
      try {
        const creditTypes = await contract.getCreditTypes();
        const _producersData = await Promise.all(
          producers.map(async (producer) => {
            const verifiers = await contract.getProducerVerifiers(producer);
            const verifiersData = await Promise.all(
              verifiers.map(async (verifier) => {
                const Supplies = await Promise.all(
                  creditTypes.map(async (creditType) => {
                    const supply = await contract.getSupply(
                      producer,
                      verifier,
                      creditType
                    );
                    return {
                      creditType,
                      issuedSupply: supply?.issued.toNumber(),
                      availableSupply: supply?.available.toNumber(),
                      donatedSupply: supply?.donated.toNumber(),
                    };
                  })
                );

                return {
                  verifier,
                  Supplies,
                };
              })
            );

            return {
              producer,
              verifiers: verifiersData,
            };
          })
        );
        setProducersData(_producersData);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to fetch producer data");
      }
    };

    if (producers) {
      fetchProducerData();
    }
  }, [producers]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const allTransactions = await Promise.all([
          contract.queryFilter(contract.filters.CreditsIssued(), 0, "latest"),
          contract.queryFilter(contract.filters.CreditsBought(), 0, "latest"),
          contract.queryFilter(
            contract.filters.CreditsTransferred(),
            0,
            "latest"
          ),
          contract.queryFilter(contract.filters.CreditsDonated(), 0, "latest"),
          contract.queryFilter(
            contract.filters.CertificateCreated(),
            0,
            "latest"
          ),
        ]);

        // Flatten the transactions array
        const flattenedTransactions = allTransactions.reduce(
          (arr, events) => arr.concat(events),
          []
        );

        const eventsData = await Promise.all(
          flattenedTransactions.map(async (event) => {
            const _timestamp = await getEventTimestamp(event.blockNumber);
            return {
              txHash: event.transactionHash,
              event: event.event,
              args: event.args,
              timestamp: _timestamp,
            };
          })
        );

        setEvents(eventsData);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to fetch events");
      }
    }

    fetchEvents();
  }, [updateUI]);

  useEffect(() => {
    // Setup event listeners for relevant contract events
    const creditsIssuedFilter = contract.filters.CreditsIssued();
    const creditsBoughtFilter = contract.filters.CreditsBought();
    const creditsTransferredFilter = contract.filters.CreditsTransferred();
    const creditsDonatedFilter = contract.filters.CreditsDonated();
    const certificateCreatedFilter = contract.filters.CertificateCreated();

    const handleEvent = (event) => {
      setUpdateUI(!updateUI);
    };

    contract.on(creditsIssuedFilter, handleEvent);
    contract.on(creditsBoughtFilter, handleEvent);
    contract.on(creditsTransferredFilter, handleEvent);
    contract.on(creditsDonatedFilter, handleEvent);
    contract.on(certificateCreatedFilter, handleEvent);

    // Cleanup function to remove the event listeners when the component unmounts
    return () => {
      contract.off(creditsIssuedFilter, handleEvent);
      contract.off(creditsBoughtFilter, handleEvent);
      contract.off(creditsTransferredFilter, handleEvent);
      contract.off(creditsDonatedFilter, handleEvent);
      contract.off(certificateCreatedFilter, handleEvent);
    };
  }, []);

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const handleAccountSearchToggle = () => {
    setIsAccountSearchOpen(!isAccountSearchOpen);
  };

  return (
    <Container>
      <Content animate="visible">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <FixedTitle>
              <Heading isSmallScreen={isSmallScreen}>Recent Removals</Heading>
              <AccountSearchButton onClick={handleAccountSearchToggle}>
                Account Search
              </AccountSearchButton>
            </FixedTitle>
            <br />
            <StyledTable>
              <thead>
                <tr>
                  <StyledTh>Data</StyledTh>
                  <StyledTh>Value</StyledTh>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <StyledTd>{item.label}</StyledTd>
                    <StyledTd>{item.value}</StyledTd>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            <DynamicList>
              <Heading2>Farmers</Heading2>
              <Line width={"50%"} />
              <ProducersData producersData={producersData} />
              <Heading2>Events</Heading2>
              <Line width={"50%"} />
              {events.map((event, index) => (
                <EventData key={index} event={event} />
              ))}
            </DynamicList>
          </>
        )}
        {errorMessage && (
          <MessageContainer type="error">
            {errorMessage}
            <CloseButton type="error" onClick={clearErrorMessage}>
              Close
            </CloseButton>
          </MessageContainer>
        )}
        <AccountSearch
          isOpen={isAccountSearchOpen}
          setIsOpen={handleAccountSearchToggle}
        />
      </Content>
    </Container>
  );
}

export default ExplorerPage;
