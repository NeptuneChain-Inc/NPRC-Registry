import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import MapBox from "../elements/MapBox";
import { STRIPE_PUBLISHABLE_KEY } from "../../contracts/ref";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { colors } from "../../data/styles";
import { sContract } from "../../contracts/contractRef";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function sortByHighestSupply(list) {
  return list.sort((a, b) => b.supply - a.supply);
}

const FormRow = styled.form`
  display: flex;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleUp = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin: 1rem 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100vw;
  height: 100vh;
  animation: ${fadeIn} 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 100%;
  max-width: 900px;
  padding: 1rem;
  // border: 2px solid black;
  margin: 1rem auto; /* Center the content */
  overflow-x: hidden;
  align-items: flex-start; /* Align content to the top of the container */

  @media (max-width: 768px) {
    justify-content: flex-start;
`;

const SupplierTableWrapper = styled(Container)`
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  width: 90%;
  height: 50%;
  max-width: 600px;
  margin: 0;
  // border: 2px solid red;
`;

const SupplierCard = styled.div`
  width: 50%;
  height: 100%;
  // border: 2px solid red;
  margin-bottom: 1rem;
  margin-right: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const SubHeading = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const CardContent = styled.p`
  margin: 0 5px;
  margin-bottom: 8px;
  font-size: 0.8rem;
`;

const Description = styled.p`
  margin-bottom: 1rem;
  text-align: justify;
  font-size: 0.9rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  width: 100%;
  margin-bottom: 2rem;
  text-align: left;
  padding: 20px;
`;

const Label = styled.label`
  margin: 0.5rem 0;
`;

const SupplierButton = styled.button`
  padding: 0.5rem 1rem;
  margin-top: 10px;
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
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }
`;

const SupplierTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  @media (max-width: 768px) {
    font-size: 3vw;
  }
`;

const TableHeader = styled.th`
  padding: 0.5rem;
  background-color: #568ca9;
  text-align: center;
`;

const TableRow = styled.tr`
  background-color: #b6ceda;
  cursor: pointer;
  transition: 0.5s ease-in-out;

  &:hover {
    background-color: #0e618d50;
  }
`;

const TableCell = styled.td`
  padding: 0.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  animation: ${scaleUp} 0.5s ease-in-out;
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

const SupplierCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  ${({ popup }) => popup && "filter: blur(20px);"}

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PurchaseContentWrapper = styled.div`
  width: 100%;

  @media (min-width: 769px) {
    width: 50%;
  }
`;

const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding: 5px;
  background-color: #fff;
`;

const FormSection = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
`;

const CheckoutInfo = styled(Description)`
  text-align: left;
  width: 150px;
  font-style: italic;
  font-size: 0.8rem;
  margin: 0;
`;

const Heading = styled.h1`
  border: 0px solid;
  box-sizing: border-box;
  border-color: rgba(250, 251, 251, 1);
  margin: 0px;
  font-weight: 700;
  letter-spacing: -0.01em;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const Input = styled.input`
  border: 0px solid;
  box-sizing: border-box;
  margin: 0px;
  font-family: inherit;
  outline: none;
  border-width: 1px;
  appearance: none;
  background-color: rgb(255, 255, 255);
  display: block;
  width: 90%;
  border-radius: 0.25rem;
  border-color: rgba(228, 231, 233, 1);
  padding: 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 700;
  color: rgba(31, 33, 35, 1);
`;

const Button = styled.button`
  border: 0px solid;
  box-sizing: border-box;
  border-color: rgba(250, 251, 251, 1);
  margin: 0px;
  font-family: inherit;
  text-transform: none;
  background-image: none;
  cursor: pointer;
  padding: 0px;
  appearance: button;
  width: 90%;
  border-radius: 0.25rem;
  background: ${colors.accent};
  text-align: center;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 700;
  color: white;
  padding-left: 1.75rem;
  padding-right: 1.75rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  margin-top: 20px;
`;

const getCreditPrice = (creditType) => {
  const type = creditType.toLowerCase();
  switch (type) {
    case "nitrogen":
      return 20;
    case "phosphorus":
      return 60;
    default:
      return null;
  }
};

const Purchase = () => {
  const [producers, setProducers] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [producerList, setProducerList] = useState([]);
  const [supplierTable, setSupplierTable] = useState(false);
  const [name, setName] = useState("Anonymous");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastCertId, setlastCertId] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  // Query the contract to retrieve the list of producers
  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const _lastCertId = await sContract.getTotalCertificates();
        setlastCertId(_lastCertId.toNumber());
        const producers = await sContract.getProducers();
        setProducers(producers);
      } catch (error) {
        console.error("Error fetching producers:", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    fetchProducers();
  }, []);

  // Fetch verifiers and issued supply for each producer
  useEffect(() => {
    const fetchProducerVerifierPairs = async () => {
      try {
        const creditTypes = await sContract.getCreditTypes();
        const pairs = [];
        for (const producer of producers) {
          const verifiers = await fetchProducerVerifiers(producer);
          for (const verifier of verifiers) {
            for (const type of creditTypes) {
              const supply = await fetchIssuedSupply(producer, verifier, type);
              const pair = { type, producer, verifier, supply };
              pairs.push(pair);
            }
          }
        }
        const sorted = sortByHighestSupply(pairs);
        setProducerList(sorted);
      } catch (error) {
        console.error("Error fetching producer/verifier pairs:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    if (producers) {
      fetchProducerVerifierPairs();
    }
  }, [producers]);

  useEffect(() => {
    if (producerList.length > 0) {
      setSelectedProducer(producerList[0]);
    }
  }, [producerList]);

  useEffect(() => {
    if (selectedProducer) {
      setLoading(false);
    }
  }, [selectedProducer]);

  const fetchProducerVerifiers = async (producer) => {
    try {
      const verifiers = await sContract.getProducerVerifiers(producer);

      return verifiers;
    } catch (error) {
      console.error("Error fetching producer verifiers:", error);
      setError("Error fetching data. Please try again later.");
      return [];
    }
  };

  const fetchIssuedSupply = async (producer, verifier, creditType) => {
    try {
      const supply = await sContract.getSupply(producer, verifier, creditType);
      const _availableSupply = supply.available.toNumber();
      return _availableSupply;
    } catch (error) {
      console.error("Error fetching issued supply:", error);
      setError("Error fetching data. Please try again later.");
      return 0;
    }
  };

  const onSuccess = async () => {
    await sContract.buyCredits(
      name,
      selectedProducer?.producer,
      selectedProducer?.verifier,
      selectedProducer?.type,
      quantity,
      getCreditPrice(selectedProducer?.type)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSuccess();

      await stripe.redirectToCheckout({
        lineItems: [
          {
            price: "price_1NTM9DFnymUk0uH4xsatNVpd", // id of the price to purchase
            quantity: quantity,
          },
        ],
        mode: "payment",
        successUrl: `http://neptunechain.io/certificate?id=${lastCertId + 1}`,
        clientReferenceId: name + Date.now.toString(), // generate order id
      });
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSupplierTable = () => {
    setSupplierTable(!supplierTable);
  };

  return (
    <Container>
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <Content>
          <SupplierCardWrapper popup={supplierTable}>
            <SupplierCard>
              <div
                style={{
                  background: "#222",
                  padding: "2px",
                  borderRadius: "10px",
                }}
              >
                <MapBox />
                <InfoBox>
                  <CardContent>
                    Type:
                    <hr />
                    {selectedProducer?.type.toUpperCase()}
                  </CardContent>
                  <CardContent>
                    Supplier:
                    <hr />
                    {selectedProducer?.producer.toUpperCase()}
                  </CardContent>
                  <CardContent>
                    Verifed by:
                    <hr />
                    {selectedProducer?.verifier.toUpperCase()}
                  </CardContent>
                  <CardContent>
                    Supply:
                    <hr />
                    {selectedProducer?.supply + " NPCs"}
                  </CardContent>
                </InfoBox>
              </div>
              <SupplierButton onClick={handleToggleSupplierTable}>
                Change Supplier
              </SupplierButton>
            </SupplierCard>
            <PurchaseContentWrapper>
              <Heading>Buy Nutrient Pollution Certificates</Heading>
              <Description>
                Remove Nutrient Pollution, support the environment, and create
                an impact you can count on. All NeptuneChain Nutrient Pollution
                Credits (NPCs) are third-party verified and come with a
                certificate that transparently certifies your ownership.
              </Description>
              <StyledForm onSubmit={handleSubmit}>
                <FormRow>
                  <CheckoutInfo>
                    <h3>Nutrient Pollution Removal Credits</h3>
                    One Nutrient Pollution Credit represents approximately 1
                    tonne of Nutrient Pollution Removed.
                  </CheckoutInfo>
                  <FormSection>
                    <Label htmlFor="name">Name on Certificate:</Label>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      placeholder="Leave Blank to Stay Anonymous"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Label htmlFor="quantity">Quantity:</Label>
                    <Input
                      type="number"
                      id="quantity"
                      value={quantity}
                      max={selectedProducer?.supply}
                      defaultValue="1"
                      placeholder="Enter NPC Amount"
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                  </FormSection>
                </FormRow>
                <Button
                  id="remove-carbon-button"
                  className="py-1.5 px-6 text-sm md:py-2.5 md:px-7 font-bold rounded focus:ring-4 focus:ring-teal-700 focus:ring-opacity-50 text-center text-gray-900 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 w-full"
                  type="submit"
                >
                  Checkout Now
                </Button>
              </StyledForm>
            </PurchaseContentWrapper>
          </SupplierCardWrapper>
          {supplierTable && (
            <SupplierTableWrapper>
              <FontAwesomeIcon
                onClick={handleToggleSupplierTable}
                icon={faTimes}
              />
              <SubHeading>Available Suppliers:</SubHeading>
              <SupplierTable>
                <thead>
                  <tr>
                    <TableHeader>Credit Type</TableHeader>
                    <TableHeader>Producer</TableHeader>
                    <TableHeader>Verifier</TableHeader>
                    <TableHeader>Available Supply</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {producerList.map((producer, index) => (
                    <TableRow
                      key={index}
                      onClick={() => {
                        setSelectedProducer(producer);
                        setSupplierTable(false);
                      }}
                    >
                      <TableCell>{producer?.type.toUpperCase()}</TableCell>
                      <TableCell>{producer?.producer.toUpperCase()}</TableCell>
                      <TableCell>{producer?.verifier.toUpperCase()}</TableCell>
                      <TableCell>{producer?.supply}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </SupplierTable>
            </SupplierTableWrapper>
          )}
        </Content>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

const PurchaseScreen = () => {
  return (
    <Elements stripe={stripePromise}>
      <Purchase />
    </Elements>
  );
};

export default PurchaseScreen;
