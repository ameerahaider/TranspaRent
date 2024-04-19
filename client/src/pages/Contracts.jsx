import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Web3 from 'web3';
import RentalContract from "../contracts/AgreementFactory.json"; // Make sure this path is correct
import DisputeContract from "../contracts/DisputeResolution.json"; // Make sure this path is correct
import PaymentContract from "../contracts/Payment.json"; // Make sure this path is correct

export default function Contracts() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [contract1, setContract1] = useState(null);
  const [contract2, setContract2] = useState(null);
  const [contract3, setContract3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [LandlordTable, setLandlordTable] = useState([]);
  const [TenantTable, setTenantTable] = useState([]);
  const [landlordPropertyIds, setLandlordPropertyIds] = useState([]);
  const [tenantPropertyIds, setTenantPropertyIds] = useState([]);
  const [landlordIds, setLandlordIds] = useState([]);
  const [tenantIds, setTenantIds] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedContractDetails, setSelectedContractDetails] = useState(null);
  const [selectedTenantContractDetails, setSelectedTenantContractDetails] = useState(null);
  const [isTenantPopupVisible, setIsTenantPopupVisible] = useState(false);
  //const [terminatedContracts, setTerminatedContracts] = useState([]);
  const [agreementID, setAgreementID] = useState(0); // State variable to store agreement ID
  const [disputeTitle, setDisputeTitle] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [isDisputePopupVisible, setIsDisputePopupVisible] = useState(false);
  const [disputeDetails, setDisputeDetails] = useState(null); //new
  const [isDisputeDetailsPopupVisible, setIsDisputeDetailsPopupVisible] = useState(false);
  const [selectedAgreementID, setSelectedAgreementID] = useState(null);
  //const [disputeDetails2, setDisputeDetails2] = useState(null); //new
  const [isPopupVisible2, setIsPopupVisible2] = useState(false);
  const [resolution, setResolution] = useState("");
  const [disputeDetails2, setDisputeDetails2] = useState([]);




  // useEffect(() => {
  //   // Load terminated contracts from local storage or database when component mounts
  //   const terminatedContractsFromStorage = JSON.parse(localStorage.getItem('terminatedContracts')) || [];
  //   setTerminatedContracts(terminatedContractsFromStorage);
  // }, []);

  // useEffect(() => {
  //   // Save terminated contracts to local storage or database when terminatedContracts state changes
  //   localStorage.setItem('terminatedContracts', JSON.stringify(terminatedContracts));
  // }, [terminatedContracts]);


  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const networkId = await web3.eth.net.getId();
        const deployedNetwork1 = RentalContract.networks[networkId];
        const deployedNetwork2 = DisputeContract.networks[networkId];
        const deployedNetwork3 = PaymentContract.networks[networkId];


        if (!deployedNetwork1) {
          throw new Error("Contract network not found");
        }

        if (!deployedNetwork2) {
          throw new Error("Contract network not found");
        }

        if (!deployedNetwork3) {
          throw new Error("Contract network not found");
        }

        const contractInstance1 = new web3.eth.Contract(
          RentalContract.abi,
          deployedNetwork1.address
        );

        const contractInstance2 = new web3.eth.Contract(
          DisputeContract.abi,
          deployedNetwork2.address
        );

        const contractInstance3 = new web3.eth.Contract(
          PaymentContract.abi,
          deployedNetwork3.address
        );

        const accs = await web3.eth.getAccounts();
        setAccounts(accs);
        setContract1(contractInstance1);
        setContract2(contractInstance2);
        setContract3(contractInstance3);
        console.log("doneeee");
      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    };

    initWeb3();
  }, []);

  const fetchLandlordTable = async () => {
    try {
      const data = await contract1.methods.getLandlordsContracts(accounts[currentUser.index]).call();
      setLandlordTable(data);
      console.log("Fetched data: ", data);
      const propertyIds = data.map(contract => contract.propertyID);
      setLandlordPropertyIds(propertyIds);
      const tenant_Ids = data.map(contract => contract.tenant);
      setTenantIds(tenant_Ids)
      // Adjust the account index as per your application's logic
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const fetchTenantTable = async () => {
    try {
      const data = await contract1.methods.getTenantsContracts(accounts[currentUser.index]).call();
      setTenantTable(data);
      console.log("Fetched tanat: ", data);
      const propertyIds = data.map(contract => contract.propertyID);
      //console.log("prop", propertyIds)
      setTenantPropertyIds(propertyIds);
      //console.log("tp", tenantPropertyIds)
      const landlord_Ids = data.map(contract => contract.landlord);
      setLandlordIds(landlord_Ids);
      // Adjust the account index as per your application's logic
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  useEffect(() => {
    if (contract1 && contract2) {
      fetchLandlordTable();
      fetchTenantTable();
      console.log("ll", landlordPropertyIds)
      console.log("lid", landlordIds)
      console.log("tid", tenantIds)
      console.log("tt", tenantPropertyIds)
    }
  }, [contract1]);

  const convertStatus = (statusIndex) => {
    const statusMapping = ['Pending', 'Active', 'Terminated']; // Adjust based on your contract
    return statusMapping[parseInt(statusIndex, 10)];
  };


  const handleLandlordDetailsClick = async (tenant, propertyID) => {
    try {
      const landlordAddress = accounts[currentUser.index]; // Current user's address
      // Assuming `contract1` is your contract instance and it has a method to fetch details
      const details = await contract1.methods.getContractDetails(tenant, landlordAddress, propertyID).call();
      setSelectedContractDetails({
        propertyID: details.propertyID,
        tenant: details.tenant,
        tenantUsername: details.tenantUsername,
        rentAmount: details.rentAmount.toString(),
        securityDeposit: details.securityDeposit.toString(),
        leaseDuration: details.leaseDuration.toString(),
        startDate: details.startDate.toString(),
        terminationDate: details.terminationDate.toString(),
        status: convertStatus(details.status)
      });
      setIsPopupVisible(true);
    } catch (error) {
      console.error("Error fetching contract details:", error);
    }
  };


  const handleTenantDetailsClick = async (landlord, propertyID) => {
    try {
      // Assuming `contract1` is your contract instance and it has a method to fetch details
      const tenantAddress = accounts[currentUser.index]; // Current user's address
      const details = await contract1.methods.getContractDetails(tenantAddress, landlord, propertyID).call();
      setSelectedTenantContractDetails({
        propertyID: details.propertyID,
        landlord: details.landlord,
        landlordUsername: details.landlordUsername,
        rentAmount: details.rentAmount.toString(),
        securityDeposit: details.securityDeposit.toString(),
        leaseDuration: details.leaseDuration.toString(),
        startDate: details.startDate.toString(),
        terminationDate: details.terminationDate.toString(),
        status: convertStatus(details.status)
      });
      setIsTenantPopupVisible(true);
    } catch (error) {
      console.error("Error fetching tenant contract details:", error);
    }
  };

  const handleLandlordTerminate = async (tenant, propertyID) => {
    try {
      await contract1.methods.terminateAgreement(tenant, accounts[currentUser.index], propertyID).send({ from: accounts[currentUser.index] });
      alert("Agreement terminated successfully!");
      //const response = await contract3.methods.disapprovePayment(tenant, accounts[currentUser.index], propertyID).send({ from: accounts[currentUser.index] });
      //console.log("Payment disapproved successfully. Transaction hash:", response.transactionHash);
      // Update rented field in the listing model
      const responseListing = await fetch(`/api/listing/update/rentedFalse/${propertyID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rented: false })
      });

      window.location.reload(); // Refresh the page
    } catch (error) {
      alert("Contract already terminated!");
      console.error("Error terminating agreement:", error);
    }
  };


  const handleRaiseDispute = async (landlord, propertyID) => {
    try {
      //alert("Raised Dispute successfully!");
      const fetchedAgreementID = await contract1.methods.getContractID(accounts[currentUser.index], landlord, propertyID).call();
      console.log("AgreementID: ", fetchedAgreementID.toString())
      setAgreementID(fetchedAgreementID);
      setIsDisputePopupVisible(true);

      // window.location.reload(); // Refresh the page
    } catch (error) {
      alert("Failed to raised dispute!");
      console.error("Error raising dispute:", error);
    }
  };


  const submitDispute = async () => {
    try {
      // Call the raiseDispute function with the provided title, reason, and agreementID
      console.log("agreement id", agreementID.toString())
      console.log("disputeTitle ", disputeTitle)
      console.log("disputeReason ", disputeReason)
      //await contract1.methods.raiseDispute(agreementID, disputeTitle, disputeReason).send({ from: accounts[currentUser.index] });
      const gasEstimate = await contract1.methods.raiseDispute(agreementID, disputeTitle, disputeReason).estimateGas({ from: accounts[currentUser.index] });
      await contract1.methods.raiseDispute(agreementID, disputeTitle, disputeReason).send({ from: accounts[currentUser.index], gas: gasEstimate });
      // const details  = await contract1.methods.getAllDisputes(agreementID).call(); 
      // console.log ("disputes: ", details.toString())
      alert("Dispute raised successfully!");
      setIsDisputePopupVisible(false); // Close the popup after submitting
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error raising dispute:", error);
    }
  };

  //JSX for dispute popup
  const DisputePopup = () => (
    isDisputePopupVisible && (
      <div style={{ position: "fixed", top: "20%", left: "25%", right: "25%", backgroundColor: "white", padding: "20px", border: "1px solid #ccc", zIndex: 100, overflowY: "auto", maxHeight: "60%", borderRadius: "8px" }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Raise Dispute</h2>
        <label>Title: </label>
        <input
          type="text"
          value={disputeTitle}
          onChange={(e) => setDisputeTitle(e.target.value)} // Update disputeTitle state on change
        />
        <label>Reason: </label>
        <textarea
          value={disputeReason}
          onChange={(e) => setDisputeReason(e.target.value)} // Update disputeReason state on change
        ></textarea>
        <button onClick={submitDispute} style={{ marginTop: "20px", width: "100%", padding: "10px", borderRadius: "5px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>Submit</button>
        <button onClick={() => setIsDisputePopupVisible(false)} style={{ marginTop: "10px", width: "100%", padding: "10px", borderRadius: "5px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>Cancel</button>
      </div>
    )
  );


  const handleTenantTerminate = async (landlord, propertyID) => {
    try {
      await contract1.methods.terminateAgreement(accounts[currentUser.index], landlord, propertyID).send({ from: accounts[currentUser.index] });
      alert("Agreement terminated successfully!");

      // Update rented field in the listing model
      const responseListing = await fetch(`/api/listing/update/rentedFalse/${propertyID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rented: false })
      });

      window.location.reload(); // Refresh the page
    } catch (error) {
      alert("Contract already terminated!");
      console.error("Error terminating agreement:", error);
    }
  };


  const handleApprove = async (tenant, propertyID) => {
    try {
      const response = await contract1.methods.approveAgreement(tenant, accounts[currentUser.index], propertyID).send({ from: accounts[currentUser.index] });
      console.log("Response from approveAgreement:", response); // Log the response
      const response2 = await contract3.methods.makePayment(tenant, accounts[currentUser.index], propertyID).send({ from: accounts[currentUser.index] });
      console.log("Payment disapproved successfully. Transaction hash:", response2.transactionHash);

      alert("Agreement Approved successfully!");

      // Fetch updated contract details after approval
      await contract1.methods.getContractDetails(tenant, accounts[currentUser.index], propertyID).call();
      //console.log("Updated contract details:", updatedContractDetails); // Log updated contract details
      window.location.reload();
      // Extract status from updated contract details using the correct index or key
    } catch (error) {
      alert("Failed to Approve");
      console.error("Error approving agreement:", error);
    }
  };


  // Simple Popup Component
  // const ContractDetailsPopup = () => (
  //   isPopupVisible && (
  //     <div style={{ position: "fixed", top: "20%", left: "25%", backgroundColor: "white", padding: "20px", border: "1px solid #ccc", zIndex: 100 }}>
  //       {/* Display contract details here. Example: */}
  //       <p>Property ID: {selectedContractDetails && selectedContractDetails.propertyID}</p>
  //       {/* Add more details you want to display */}

  //       <button onClick={() => setIsPopupVisible(false)}>Close</button>
  //     </div>
  //   )
  // );

  const handleViewDisputesTenant = async (landlord, propertyID) => {
    try {
      // Fetch all disputes associated with the agreementID
      // if (!agreementID || isNaN(agreementID)) {
      //   throw new Error("Invalid agreement ID");
      // }
      const fetchedAgreementID = await contract1.methods.getContractID(accounts[currentUser.index], landlord, propertyID).call();
      console.log("AgreementID: ", fetchedAgreementID.toString())
      //setSelectedAgreementID(agreementID);
      const disputes = await contract1.methods.getAllDisputes(fetchedAgreementID).call();
      setDisputeDetails(disputes);
      console.log("disputes", disputes)
      setIsDisputeDetailsPopupVisible(true);
    } catch (error) {
      console.error("Error fetching disputes:", error);
    }
  };

  const convertDisputeStatus = (statusIndex) => {
    const statusMapping = ['Pending', 'Resolved']; // Adjust based on your contract
    return statusMapping[parseInt(statusIndex, 10)];
  };

  // // Dispute Details Popup
  // const DisputeDetailsPopup = () => (

  // );
  const handleViewDisputes2 = async (tenant, propertyID) => {
    try {
      const fetchedAgreementID = await contract1.methods.getContractID(tenant, accounts[currentUser.index], propertyID).call();
      const disputes = await contract1.methods.getAllDisputes(fetchedAgreementID).call();
      setDisputeDetails2(disputes);
      setIsPopupVisible2(true);
    } catch (error) {
      console.error("Error fetching disputes:", error);
    }
  };

  const resolveDispute2 = async (disputeId) => {
    try {
      await contract2.methods.resolveDispute(disputeId, resolution).send({ from: accounts[currentUser.index] });
      setIsPopupVisible2(false);
      alert("Dispute resolved successfully!");
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error resolving dispute:", error);
    }
  };






  return (
    <div style={{background: "#1f2937"}}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        {/* Popup for Displaying Landlord Contract Details */}
        {isPopupVisible && (
          <div style={{ position: "fixed", top: "20%", left: "25%", right: "25%", backgroundColor: "#fff", padding: "20px", border: "1px solid #ccc", zIndex: 100, overflowY: "auto", maxHeight: "60%", borderRadius: "8px" }}>
            <h2 style={{ marginBottom: "20px", textAlign: "center", color: "#fff" }}>Contract Details</h2>
            {selectedContractDetails && (
              <>
                <p><strong>Property ID:</strong> {selectedContractDetails.propertyID}</p>
                <p><strong>Tenant:</strong> {selectedContractDetails.tenantUsername}</p>
                <p><strong>Tenant ID:</strong> {selectedContractDetails.tenant}</p>
                <p><strong>Rent Amount:</strong> {selectedContractDetails.rentAmount}</p>
                <p><strong>Security Deposit:</strong> {selectedContractDetails.securityDeposit}</p>
                <p><strong>Lease Duration:</strong> {selectedContractDetails.leaseDuration} Month</p>
                <p><strong>Start Date:</strong> {new Date(parseInt(selectedContractDetails.startDate) * 1000).toLocaleDateString()}</p>
                <p><strong>Termination Date:</strong> {new Date(parseInt(selectedContractDetails.terminationDate) * 1000).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {selectedContractDetails.status}</p>
              </>
            )}
            <button onClick={() => setIsPopupVisible(false)} style={{ marginTop: "20px", width: "100%", padding: "10px", borderRadius: "5px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>Close</button>
          </div>
        )}

        {/* Popup for Displaying Tenant Contract Details */}
        {isTenantPopupVisible && (
          <div style={{ position: "fixed", top: "20%", left: "25%", right: "25%", backgroundColor: "#fff", padding: "20px", border: "1px solid #ccc", zIndex: 100, overflowY: "auto", maxHeight: "60%", borderRadius: "8px" }}>
            <h2 style={{ marginBottom: "20px", textAlign: "center", color: "#fff" }}>Tenant Contract Details</h2>
            {selectedTenantContractDetails && (
              <>
                <p><strong>Property ID:</strong> {selectedTenantContractDetails.propertyID}</p>
                <p><strong>Landlord:</strong> {selectedTenantContractDetails.landlordUsername}</p>
                <p><strong>Landlord ID:</strong> {selectedTenantContractDetails.landlord}</p>
                <p><strong>Rent Amount:</strong> {selectedTenantContractDetails.rentAmount}</p>
                <p><strong>Security Deposit:</strong> {selectedTenantContractDetails.securityDeposit}</p>
                <p><strong>Lease Duration:</strong> {selectedTenantContractDetails.leaseDuration} Month</p>
                <p><strong>Start Date:</strong> {new Date(parseInt(selectedTenantContractDetails.startDate) * 1000).toLocaleDateString()}</p>
                <p><strong>Termination Date:</strong> {new Date(parseInt(selectedTenantContractDetails.terminationDate) * 1000).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {selectedTenantContractDetails.status}</p>
              </>
            )}
            <button onClick={() => setIsTenantPopupVisible(false)} style={{ marginTop: "20px", width: "100%", padding: "10px", borderRadius: "5px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>Close</button>
          </div>
        )}

        {isDisputePopupVisible && (
          <div style={{ position: "fixed", top: "20%", left: "25%", right: "25%", backgroundColor: "#fff", padding: "20px", border: "1px solid #ccc", zIndex: 100, overflowY: "auto", maxHeight: "60%", borderRadius: "8px" }}>
            <h2 style={{ marginBottom: "20px", textAlign: "center", color: "#fff" }}>Raise Dispute</h2>
            <label>Title:</label>
            <input
              type="text"
              value={disputeTitle}
              onChange={(e) => setDisputeTitle(e.target.value)} // Update disputeTitle state on change
            />
            <label>Reason:</label>
            <input
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)} // Update disputeReason state on change
            />
            <button onClick={submitDispute} style={{ marginTop: "20px", width: "100%", padding: "10px", borderRadius: "5px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>Submit</button>
            <button onClick={() => setIsDisputePopupVisible(false)} style={{ marginTop: "10px", width: "100%", padding: "10px", borderRadius: "5px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>Cancel</button>
          </div>
        )}

        {isDisputeDetailsPopupVisible && disputeDetails && disputeDetails.length > 0 && (
          <div style={{ position: 'fixed', top: '20%', left: '25%', right: '25%', backgroundColor: '#fff', padding: '20px', border: '1px solid #ccc', zIndex: 100, overflowY: 'auto', maxHeight: '60%', borderRadius: '8px' }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center'}}>Dispute Details</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', fontWeight: 'bold'}}>ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', fontWeight: 'bold'}}>Title</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', fontWeight: 'bold'}}>Reason</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', fontWeight: 'bold'}}>Status</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', fontWeight: 'bold'}}>Resolution</th>
                </tr>
              </thead>
              <tbody>
                {disputeDetails.map((dispute, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px'}}>{dispute.ID.toString()}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px'}}>{dispute.title}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px'}}>{dispute.reason}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px'}}>{convertDisputeStatus(dispute.status)}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px'}}>{dispute.resolution || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setIsDisputeDetailsPopupVisible(false)} style={{ marginTop: '20px', width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
          </div>
        )}
        {/* Dispute Popup */}
        {isPopupVisible2 && disputeDetails2 && disputeDetails2.length > 0 && (
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '30px', border: '1px solid #ccc', zIndex: 100, overflowY: 'auto', maxHeight: '80%', borderRadius: '8px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ textAlign: 'center', margin: 0, fontSize: '24px' }}>Dispute Details</h2>
              <button onClick={() => setIsPopupVisible2(false)} style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: '24px', color: '#666' }}>×</button>
            </div>
            <table style={{ width: '100%', fontSize: '18px' }}>
              <thead>
                <tr>
                  <th style={{ width: '10%', padding: '10px'}}>ID</th>
                  <th style={{ width: '20%', padding: '10px'}}>Title</th>
                  <th style={{ width: '20%', padding: '10px'}}>Reason</th>
                  <th style={{ width: '12%', padding: '10px'}}>Status</th>
                  <th style={{ width: '24%', padding: '10px'}}>Resolution</th>
                  <th style={{ width: '14%', textAlign: 'right', padding: '10px', color: '#fff' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {disputeDetails2.map((dispute, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px' }}>{dispute.ID.toString()}</td>
                    <td style={{ padding: '10px' }}>{dispute.title}</td>
                    <td style={{ padding: '10px' }}>{dispute.reason}</td>
                    <td style={{ padding: '10px' }}>{convertDisputeStatus(dispute.status)}</td>
                    <td style={{ padding: '10px' }}>
                      {convertDisputeStatus(dispute.status) !== 'Resolved' && (
                        <input type="text" value={resolution} onChange={(e) => setResolution(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px' }} />
                      )}
                    </td>
                    <td style={{ textAlign: 'right', padding: '10px', color: '#fff' }}>
                      {convertDisputeStatus(dispute.status) !== 'Resolved' && (
                        <button onClick={() => resolveDispute2(dispute.ID)} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}>Resolve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h1 style={{ textAlign: "center", marginBottom: "10px", fontWeight: "bold", fontSize: "24px", color: "#fff" }}>
          Contract Management
        </h1>
        <div style={{ textAlign: "center", marginBottom: "20px", fontSize: "18px", color: "#fff", fontStyle: "italic" }}>
          Username: {currentUser.username}
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px", fontSize: "18px", color: "#fff", fontStyle: "italic" }}>
          Account Address: {accounts[currentUser.index]}
        </div>

        {/* Landlord Contracts Table */}
        <h2 style={{ textAlign: "center", margin: "20px 0", fontWeight: "bold", color: "#fff" }}>Landlord Contracts</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>Property ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>Tenant</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>Status</th> {/* New column for Status */}
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>View Details</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>View Disputes</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>Agreement</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>Terminate</th>
            </tr>
          </thead>
          <tbody>
            {LandlordTable.map((contract, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}>{contract.propertyID}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}>{contract.tenantUsername}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}>{convertStatus(contract.status)}</td> {/* Display status */}
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}>
                  <button onClick={() => handleLandlordDetailsClick(contract.tenant, contract.propertyID)} style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>Details</button>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}><button onClick={() => handleViewDisputes2(contract.tenant, contract.propertyID)} style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>Disputes</button></td>
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}>
                  {convertStatus(contract.status) !== 'Active' && convertStatus(contract.status) !== 'Terminated' ? (
                    <button onClick={() => handleApprove(contract.tenant, contract.propertyID)} style={{ backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>Approve</button>
                  ) : (
                    <button style={{ backgroundColor: "#ccc", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "not-allowed" }} disabled>Approve</button>
                  )}
                </td>

                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}>
                  <button onClick={() => handleLandlordTerminate(contract.tenant, contract.propertyID)} style={{ backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>Terminate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>



        {/* Tenant Contracts Table */}
        <h2 style={{ textAlign: "center", margin: "20px 0", fontWeight: "bold", color: "#fff" }}>Tenant Contracts</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>Property ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>Landlord</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>Status</th> {/* New column for Status */}
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>View Details</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>View Disputes</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>Raise Disputes</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", fontWeight: "bold", color: "#fff" }}>Terminate</th>
            </tr>
          </thead>
          <tbody>
            {TenantTable.map((contract, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}>{contract.propertyID}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}>{contract.landlordUsername}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}>{convertStatus(contract.status)}</td> {/* Display status */}
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}><button onClick={() => handleTenantDetailsClick(contract.landlord, contract.propertyID)} style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>Details</button></td>
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}><button onClick={() => handleViewDisputesTenant(contract.landlord, contract.propertyID)} style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>Disputes</button></td>

                {/* <DisputeDetailsPopup /> */}
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}><button onClick={() => handleRaiseDispute(contract.landlord, contract.propertyID)} style={{ backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>Raise</button></td>
                {/* Raise dispute popup */}
                <td style={{ border: "1px solid #ddd", padding: "8px", color: "#fff" }}><button onClick={() => handleTenantTerminate(contract.landlord, contract.propertyID)} style={{ backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>Terminate</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

}