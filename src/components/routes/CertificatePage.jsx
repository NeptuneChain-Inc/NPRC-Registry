import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Loading, Error, Certificate } from "../elements/index";
import { contract } from "../../contracts/contractRef";
import { formatCertificate } from "../../functions/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  align-items: center;
  text-align: center;
  justify-content: center;
  opacity: 0;
  width: 100vw;
  height: 100vh;
  animation: fadeIn 1s ease forwards;
  overflow: auto;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CertificateContainer = styled.div`
width: 100%;
padding-top: 50px; 
overflow: auto;

`;

const ShareLinksContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  border-top: 1px solid #222;
  padding-top: 10px;
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.5s ease forwards;
z-index: 100;

  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ShareLink = styled.a`
  display: inline-block;
  margin: 0 10px;
  color: #333;
  transition: all 0.3s ease;
  width: 24px;
  cursor: pointer;

  &:hover {
    color: #0d5b84;
    transform: translateY(-3px) scale(1.1);
  }
`;

function createFacebookShareLink(url) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
}

function createTwitterShareLink(url, text) {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(text)}`;
}

function createLinkedInShareLink(url, title, summary) {
  return `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
    url
  )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
    summary
  )}`;
}

const shareText = "My NeptuneChain Certificate";

const CertificatePage = () => {
  const { id } = useParams();
  const certUrl = window.location.href;
  const [certificate, setCertificate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const certificate = await contract.getCertificateById(id);
        const certId = certificate.id.toNumber();
        if (certId > 0) {
          const formattedCertificate = formatCertificate(certificate);
          setCertificate(formattedCertificate);
        } else {
          setError("Certificate Not Found");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Container>
      <CertificateContainer>

      <Certificate data={certificate}/>
      </CertificateContainer>
      
      <ShareLinksContainer>
        <ShareLink href={createFacebookShareLink(certUrl)} target="_blank">
          <FontAwesomeIcon icon={faFacebookF} />
        </ShareLink>
        <ShareLink
          href={createTwitterShareLink(certUrl, shareText)}
          target="_blank"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </ShareLink>
        <ShareLink
          href={createLinkedInShareLink(certUrl, shareText, "")}
          target="_blank"
        >
          <FontAwesomeIcon icon={faLinkedinIn} />
        </ShareLink>
      </ShareLinksContainer>
    </Container>
  );
};

export default CertificatePage;
