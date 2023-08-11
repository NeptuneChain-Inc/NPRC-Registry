export const hostDomain = 'https://neptunechain.io';
export const mumbaiRPC =
  "https://polygon-mumbai.g.alchemy.com/v2/2hgsU06yb8WfdNwhkxSC-IWajuWJf3jF";
export const blockExplorerTxURL = 'https://mumbai.polygonscan.com/tx';
export const contractAddressOld = "0x1D9c11DF1489b38E61d98B5A6290BFEfBB10eA48"; //Old Contract
export const contractAddressOld2 = '0x713b7B4e9E804F28d9CA6F21Bc5dEe8BAeaB0f93'; //Old Contract 2
export const contractAddress = '0xD962Adf497b2268336BDF017c609FD9C6327E164';
export const contractABI = [
  "function getOwner() view returns (address _owner)",
  "function getCreditTypes() view returns(string[] _creditTypes)",
  "function getTotalSupply() view returns (int256 _totalSupply)",
  "function getTotalDonatedSupply() view returns (int256 _totalDonatedSupply)",
  "function getTotalSold() view returns(int256 _totalSold)",
  "function getTotalCertificates() view returns (int256 _totalCertificates)",
  "function getCertificateById(int256 certificateId) view returns (tuple(int256 id, string buyer, string producer, string verifier, string creditType, int256 balance, int256 price, uint256 timestamp))",
  "function getProducers() view returns (string[] _producers)",
  "function getProducerVerifiers(string producer) view returns (string[] _producerVerifiers)",
  "function getSupply(string producer, string verifier, string creditType) view returns (tuple(int256 issued, int256 available, int256 donated))",
  "function getAccountBalance(string accountID, string producer, string verifier, string creditType) view returns (int256 _accountBalance)",
  "function getAccountTotalBalance(string accountID) view returns (int256 _accountTotalBalance)",
  "function getAccountCertificates(string accountID) view returns (int256[] _accountCertificates)",
  "function isCreditRegistered(string memory creditType) view returns (bool _creditRegistered)",
  "function isProducerRegistered(string producer) view returns (bool _producerRegistered)",
  "function isProducerVerified(string producer, string verifier) view returns (bool _producerVerified)",
  "function issueCredits(string _producer, string _verifier, string _creditType, int256 amount) returns (bool _issued)",
  "function buyCredits(string _accountID, string _producer, string _verifier, string _creditType, int256 amount, int256 price) returns (bool _creditsBought)",
  "function transferCredits(string senderAccountID, string receiverAccountID, string _producer, string _verifier, string _creditType, int256 amount, int256 price) returns (bool _creditsTransferred)",
  "function donateCredits(string _accountID, string _producer, string _verifier, string _creditType, int256 amount) returns (bool _creditsDonated)",
  "function transferOwnership(address newOwner) returns (bool)",
  "event CreditsIssued( string producer, string verifier, string creditType, int256 amount)",
  "event CreditsBought(string accountID, string producer, string verifier, string creditType, int256 amount, int256 price)",
  "event CreditsTransferred(string senderAccountID, string receiverAccountID, string producer, string verifier, string creditType, int256 amount, int256 price)",
  "event CreditsDonated(string accountID, string producer, string verifier, string creditType, int256 amount)",
  "event CertificateCreated(int256 certificateId, string accountID, string producer, string verifier, string creditType, int256 balance)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"
];

/** Keys => Not to be used in production - Only for testing purposes **/
export const privateKey = "aedf3e8b6a0192360b32005cf082c10ff2a8a4d972024322033066ef25ab4e9f"; // Test Net Only
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51NTLlPFnymUk0uH4vxETrYPfIgizozEwByB2uPCcjZFJhBLR45bYS20M3a7KTI4PTwZKg6eMPDbeOPF1PBQr0OBa000EGQPaAB'; //Test Key
export const MapBoxKey = 'pk.eyJ1IjoiZm9yYW1ha28iLCJhIjoiY2xrMWg0amQzMDIwejNmb3kxdzI3NHA0NyJ9.SGbam3R3secsVpD2G5Kgrg'; //Test Key
export const GoogleMaps_API_KEY = 'AIzaSyAcDSUHQJukOfVZjDGxsbDDlx4sTzB78sg'; //Test Key


