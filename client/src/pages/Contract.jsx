import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import RentalContract from "../contracts/AgreementFactory.json"; // Make sure this path is correct
import BN from 'bn.js';

export default function Contract() {
  const { listingId, userId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [terminationDate, setTerminationDate] = useState("");
  const [leaseDuration, setLeaseDuration] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [landlordId, setLandlordId] = useState("");
  const [landlord, setLandlord] = useState(null); // State to store landlord data
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [terms, setTerms] = useState([]);
  const [contractSubmitted, setContractSubmitted] = useState(false);
  const [leaseDurationValid, setLeaseDurationValid] = useState(true);
  const [listingIdStr, setlistingIdStr] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [showApprovalButtons, setShowApprovalButtons] = useState(false);


  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = RentalContract.networks[networkId];

        if (!deployedNetwork) {
          throw new Error("Contract network not found");
        }

        const contractInstance = new web3.eth.Contract(
          RentalContract.abi,
          deployedNetwork.address
        );

        const accs = await web3.eth.getAccounts();
        setAccounts(accs);
        setContract(contractInstance);
        console.log("doneeee");
        // setCurrentUser(accs[0]); // Assuming the first account is the current user
      } catch (error) {
        console.error("Error initializing Web3:", error);
        // Handle error state here
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`/api/user/get/${userId}`);
        // console.log("Userid",userId)
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (error) {
        setError(error.message);
      }
    };


    const fetchListingData = async () => {
      try {
        const response = await fetch(`/api/listing/get/${listingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing data");
        }
        const listingData = await response.json();
        const price =
          listingData.discountPrice !== 0
            ? listingData.discountPrice
            : listingData.regularPrice;
        setListing(listingData);
        const securityDepositAmount = price * 0.3;
        setRentAmount(price); // Prefilling rent amount from listing model
        setSecurityDeposit(securityDepositAmount); // Prefilling security deposit from listing model
        const std = listingId.toString();
        console.log("listingId:", std)
        setlistingIdStr(std);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchLandloardId = async () => {
      try {
        const response = await fetch(`/api/listing/get-with-user/${listingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing data");
        }
        const responseData = await response.json();
        const userId = responseData.user._id; // Assuming the user ID is stored in _id property
        setLandlordId(userId);
        // console.log("landlordid :", userId);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    fetchListingData();
    fetchLandloardId();
  }, [listingId, userId]);

  useEffect(() => {
    const fetchLandlordData = async () => {
      try {
        const response = await fetch(`/api/user/get/${landlordId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch landlord data");
        }
        const landlordData = await response.json();
        setLandlord(landlordData);
        console.log("currentUser index: ", currentUser.index);
      } catch (error) {
        setError(error.message);
      }
    };

    if (landlordId) {
      fetchLandlordData();
    }
  }, [landlordId]);

  if (landlord) {
    console.log("landlord index: ", landlord.index)
  }
  if (leaseDuration) {
    console.log("leaseduration", leaseDuration)
  }
  if (startDate) {
    const startDateUnix = new Date(startDate).getTime() / 1000;
    //console.log("Start date (Unix timestamp):", startDateUnix);
    //console.log("Date.now() (Unix timestamp):", Math.floor(Date.now() / 1000));
  }

  useEffect(() => {
    const duration = parseInt(leaseDuration, 10);
    setLeaseDurationValid(!isNaN(duration) && duration >= 1 && duration <= 12);
  }, [leaseDuration]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure web3 is available here
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");


    const rentAmountWeiStr = String(rentAmount);
    const securityDepositWeiStr = String(securityDeposit);
    const leaseDurationStr = String(leaseDuration);
    const stdUnixStr = String(Math.floor(new Date(startDate).getTime() / 1000));
    console.log(rentAmountWeiStr)
    console.log(securityDepositWeiStr)
    

    try {
      // Assuming `accounts` and `contract` are correctly initialized
      // and currentUser.index and landlord.index are defined and correct
      const gasEstimate = await contract.methods.createRentalAgreement(
        accounts[landlord.index],
        accounts[currentUser.index],
        landlord.username,
        currentUser.username,
        rentAmountWeiStr,
        securityDepositWeiStr,
        leaseDurationStr,
        stdUnixStr, // Using the Unix timestamp as a string
        listingIdStr
      ).estimateGas({ from: accounts[currentUser.index] });

      const response = await contract.methods.createRentalAgreement(
        accounts[landlord.index],
        accounts[currentUser.index],
        landlord.username,
        currentUser.username,
        rentAmountWeiStr,
        securityDepositWeiStr,
        leaseDurationStr,
        stdUnixStr, // Using the Unix timestamp as a string
        listingIdStr
      ).send({ from: accounts[currentUser.index], gas: gasEstimate });

      console.log("Agreement initiated successfully. Transaction hash:", response.transactionHash);
      window.alert("Agreement initiated successfully.");
      setContractSubmitted(true);
      setShowPaymentSection(true);
      setShowApprovalButtons(false);

    } catch (error) {
      console.error("Error initiating agreement:", error);
      window.alert("Error initiating Agreement.");
    }
  };

  // useEffect(() => {
  //   const fetchContractTerms = async () => {
  //     try {
  //       const contractTerms = await contract.methods.getContractDetails().call();
  //       console.log("Contract terms:", contractTerms);
  //       setTerms(contractTerms);
  //     } catch (error) {
  //       console.error("Error fetching contract terms:", error);
  //     }
  //   };

  //   if (contract) {
  //     fetchContractTerms();
  //   }
  // }, [contract]);



  useEffect(() => {
    const fetchContractTerms = async () => {
      try {
        if (!contract) {
          throw new Error("Contract instance not found");
        }

        const response = await contract.methods.getContractDetails(accounts[currentUser.index], accounts[landlord.index], listingIdStr).call();
        console.log("Contract details:", response);

        // Assuming terms are returned as an array of strings
        setTerms(response.terms);
      } catch (error) {
        console.error("Error fetching contract terms:", error);
        // Handle error state here
      }
    };

    if (contract && currentUser && landlord && contractSubmitted) {
      fetchContractTerms();
    }
  }, [contract, currentUser, landlord, contractSubmitted]);

  const handlePayment = () => {
    setShowApprovalButtons(true);
  };

  const ApproveAgreement = async () => {
    try {
      if (!contract) {
        throw new Error("Contract instance not found");
      }
  
      // Update rented field in the listing model
      const responseListing = await fetch(`/api/listing/update/rented/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rented: true })
      });
  
      if (!responseListing.ok) {
        throw new Error("Failed to update rented status");
      }
  
      // Approve the agreement
      const responseContract = await contract.methods.approveAgreement(accounts[currentUser.index], accounts[landlord.index], listingIdStr).send({ from: accounts[currentUser.index] });
  
      console.log("Agreement approved successfully. Transaction hash:", responseContract.transactionHash);
      window.alert("Agreement approved successfully.");
  
    } catch (error) {
      console.error("Error approving agreement:", error);
      window.alert("Error approving agreement: " + error.message);
    }
  };

  const DisapproveAgreement = async () => {
    try {
      if (!contract) {
        throw new Error("Contract instance not found");
      }

     // const gasEstimate = await contract.methods.disapproveAgreement(accounts[currentUser.index], accounts[landlord.index]).estimateGas();
      const response = await contract.methods.disapproveAgreement(accounts[currentUser.index], accounts[landlord.index], listingIdStr).send({ from: accounts[currentUser.index]});

      console.log("Agreement disapproved successfully. Transaction hash:", response.transactionHash);
      window.alert("Agreement disapproved successfully.");
    } catch (error) {
      console.error("Error disapproved agreement:", error);
      window.alert("Error disapproved agreement: " + error.message);
    }
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{background: "#1f2937"}}>
      <div style={{ display: "flex", justifyContent: "center", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        {/* Left side - Contract Details */}
        <div style={{ flex: 1, marginRight: "40px" }}>
          {landlordId === userId && (
            <div
              style={{ marginBottom: "10px", color: "green", fontWeight: "bold" }}
            >
              You already own this property.
            </div>
          )}
          {/* Render nothing else if landlordId matches userId */}
          {landlordId !== userId && (
            <>
              <h1
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  fontSize: "24px",
                  color: "#fff"
                }}
              >
                Contract Details
              </h1>
              {/* User and listing details */}
              {/* <div style={{ marginBottom: "10px" }}>
                <label>Tenant ID:</label>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {userId}
                </div>
              </div> */}
              {currentUser && (
                <div style={{ marginBottom: "10px", color: "#fff" }}>
                  <label>Tenant username:</label>
                  <div
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {currentUser.username}
                  </div>
                </div>
              )}
              {/* <div style={{ marginBottom: "10px" }}>
                <label>LandLord ID:</label>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {landlordId}
                </div>
              </div> */}
              {landlord && (
                <div style={{ marginBottom: "10px", color: "#fff" }}>
                  <label>LandLord username:</label>
                  <div
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {landlord.username}
                  </div>
                </div>
              )}
              <div style={{ marginBottom: "10px", color: "#fff" }}>
                <label>Listing ID:</label>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {listingId}
                </div>
              </div>
              {listing && (
                <div style={{ marginBottom: "10px", color: "#fff" }}>
                  <label>Listing Name:</label>
                  <div
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {listing.name}
                  </div>
                </div>
              )}
              {/* Lease duration, start date, termination date, rent amount, and security deposit inputs */}
              <div style={{ marginBottom: "10px" }}>
            <label className="text-white">Lease Duration (Months):</label>
            <input
              type="number"
              value={leaseDuration}
              onChange={(e) => setLeaseDuration(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {!leaseDurationValid && (
              <div style={{ color: 'red' }}>Lease Duration must be between 1 and 12 months.</div>
            )}
          </div>
              <div style={{ marginBottom: "10px" }}>
                <label className="text-white">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label className="text-white">Rent Amount:</label>
                <input
                  type="number"
                  value={rentAmount}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label className="text-white">Security Deposit:</label>
                <input
                  type="number"
                  value={securityDeposit}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              {/* Submit button */}
              <button
              onClick={handleSubmit}
              disabled={!leaseDurationValid} // Button is disabled if leaseDurationValid is false
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                background: leaseDurationValid ? "#fb8c00" : "#cccccc", // Change button color if disabled
                color: "#fff",
                cursor: leaseDurationValid ? "pointer" : "default",
                }}
              >
                Submit Contract
              </button>
            </>
          )}
        </div>
        {/* Right side - Contract Terms and Approval Button */}
        <div style={{ flex: 1, marginLeft: "40px" , color: "#fff" }}>
        {contractSubmitted && (
          <div style={{ marginBottom: "20px", fontFamily: "Arial, Helvetica, sans-serif" }}>
          <h2 style={{ fontWeight: "bold", fontFamily: "Arial, Helvetica, sans-serif" }}>Contract Terms</h2>
          {terms.map((term, index) => (
            <div key={index} style={{ marginBottom: "10px", fontFamily: "Arial, Helvetica, sans-serif" }}>
              {term}
            </div>
          ))}
        </div>
        
        )}
        {showPaymentSection && (
            <div>
              <h2 style={{ fontWeight: "bold" }}>Payment Information</h2>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Cardholder Name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  color: "#000000",
                }}
              />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  color: "#000000",
                }}
              />
              <input
                type="text"
                value={expirationMonth}
                onChange={(e) => setExpirationMonth(e.target.value)}
                placeholder="Expiration Month"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  color: "#000000",
                }}
              />
              <input
                type="text"
                value={expirationYear}
                onChange={(e) => setExpirationYear(e.target.value)}
                placeholder="Expiration Year"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  color: "#000000",
                }}
              />
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="CVC"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  color: "#000000",
                }}
              />
              <hr></hr>
              <button
                onClick={handlePayment}
                style={{
                  background: "#fb8c00",
                  width: "100%",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid ##fff",
                }}
              >
                Submit Payment
              </button>
            </div>
          )}

          {/* Approval button */}
          {showApprovalButtons &&  (
          <button
            onClick={ApproveAgreement}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              background: "#28a745", // Green color
              color: "#fff",
              cursor: "pointer",
              marginTop: "10px", // Add margin top for spacing
            }}
          >
            Approve
          </button>
          )}

  {showApprovalButtons && (
          <button
            onClick={DisapproveAgreement}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              background: "#dc3545", // Red color
              color: "#fff",
              cursor: "pointer",
              marginTop: "10px", // Add margin top for spacing
            }}
          >
            Disapprove
          </button>
          )}
        </div>
      </div>
    </div>
  );



}
